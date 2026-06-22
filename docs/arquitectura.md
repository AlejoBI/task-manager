# Diagramas de secuencia — TaskMaster

## 1. Autenticación (registro, login, logout, sesión persistente)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant AP as AuthenticationPage
  participant FH as errorHelpers
  participant AC as AuthContext
  participant FA as Firebase Auth
  participant Router as React Router
  participant PR as ProtectedRoute
  participant TP as TasksPage

  Note over U,TP: FLUJO REGISTRO / LOGIN

  U->>AP: Submit email + password
  AP->>AP: ¿password.length < 6?
  alt contraseña corta
    AP-->>U: Error: "mínimo 6 caracteres"
    Note over AP: Validación cliente,<br/>no llama a Firebase
  else contraseña válida
    AP->>AC: register / login(email, pass)
    Note over AC: Sin try/catch,<br/>errores Firebase se propagan
    AC->>FA: createUserWithEmailAndPassword /<br/>signInWithEmailAndPassword
    alt éxito
      FA-->>AC: UserCredential
      AC-->>AP: ok
      AP->>Router: navigate(from, { replace: true })
      Note over AP: 'from' viene de<br/>location.state o "/tasks"
      Router-->>U: Redirige a /tasks (o ruta original)
    else error Firebase
      FA-x AC: FirebaseError { code, message }
      AC-x AP: propaga el error
      AP->>FH: getErrorCode(err)
      FH-->>AP: "auth/email-already-in-use"
      AP->>AP: ERROR_MESSAGES[code] ?? "Error inesperado..."
      Note over AP: Si code = "auth/too-many-requests"<br/>extrae retryAfter de customData<br/>y agrega "Volvé a intentar en N seg"
      AP-->>U: Muestra error en español
    end
  end

  Note over U,TP: FLUJO LOGOUT

  U->>Header: Click "Salir"
  Header->>AC: logout()
  AC->>FA: signOut(auth)
  FA-->>AC: ok
  AC-->>Header: ok
  Header->>Router: navigate("/")
  Router-->>U: Redirige a Home
  Note over FA,PR: onAuthStateChanged → user = null
  PR->>PR: user es null → redirect a /login

  Note over U,TP: FLUJO SESIÓN PERSISTENTE (recarga)

  U->>PR: Recarga la página en /tasks
  PR->>AC: useAuth()
  AC->>FA: onAuthStateChanged (pendiente)
  PR-->>U: Spinner de carga
  alt token Firebase válido
    FA-->>AC: user (User | null)
    AC-->>PR: { user: {...}, loading: false }
    PR->>PR: user existe → renderiza children
    PR-->>U: Muestra TasksPage
  else sin sesión
    FA-->>AC: null
    AC-->>PR: { user: null, loading: false }
    PR->>PR: user null → redirect
    PR->>Router: Navigate /login + state.from
    Router-->>U: LoginPage + redirect pendiente
  end
```

---

## 2. Tareas en tiempo real (suscripción, CRUD, propagación)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant TP as TasksPage
  participant TS as taskService
  participant FS as Firestore
  participant TCard as TaskCard
  participant TForm as TaskForm
  participant FH as errorHelpers

  Note over U,FH: FLUJO CARGA INICIAL (onSnapshot)

  TP->>TP: useEffect: subscribeTasks(userId)
  TP->>TS: subscribeTasks(userId, onData, onError)
  TS->>FS: onSnapshot(query)
  Note over TS: query: userId + createdAt desc
  alt éxito
    FS-->>TS: QuerySnapshot
    TS->>TS: toTask() por cada doc
    Note over TS: Convierte Timestamps,<br/>valida priority,<br/>defaults para name
    TS-->>TP: Task[]
    TP->>TP: setTasks(data), setLoading(false)
    TP->>TP: useMemo → filtra (all/pending/completed/overdue) + ordena (overdue al top) + counts
    TP-->>U: Renderiza TaskCards<br/>TCard: si overdue → badge rojo "Atrasada"
  else error suscripción
    FS--xTS: FirestoreError
    TS-->>TP: onError(err)
    TP->>FH: getErrorMessage(err)
    TP-->>U: Banner rojo "Error al cargar tareas: ..."
  end

  Note over U,FH: FLUJO CREAR TAREA

  U->>TForm: Completa y submit
  TForm->>TForm: ¿name.trim() vacío?
  Note over TForm: Validación cliente,<br/>no llama al padre
  TForm->>TP: onAddTask({ name, priority, dueDate })
  TP->>TP: setSubmitting(true), setError(null)
  TP->>TS: createTask(userId, data)
  TS->>FS: addDoc(collection, { userId, name, priority,<br/>dueDate: Timestamp, completed: false, createdAt })
  alt éxito
    FS-->>TS: DocumentReference
    TS-->>TP: ok
    TP->>TP: setSubmitting(false)
  Note over FS,TP: onSnapshot detecta el cambio<br/>automáticamente
  FS-->>TS: nuevo snapshot
  TS-->>TP: onData(updatedTasks)
  TP->>TP: setTasks(updatedTasks)
  TP->>TP: useMemo → filtra + ordena (overdue al top)
  TP-->>U: Nueva tarea aparece en grid
  TP-->>TForm: ok (el try no lanzó)
  TForm->>TForm: Reset: name="", priority="MEDIUM", dueDate=""
  else error creación
    FS--xTS: FirestoreError
    TS--xTP: lanza excepción
    TP->>FH: getErrorMessage(err)
    TP->>TP: setError("Error al crear tarea: ...")
    TP->>TP: setSubmitting(false)
    TP-->>U: Banner rojo con error
    Note over TForm: catch vacío: conserva valores<br/>para que usuario reintente
  end

  Note over U,FH: FLUJO TOGGLE COMPLETADO

  U->>TCard: Click checkbox
  Note over TCard: Tarea se tacha + opacidad 60%<br/>Si estaba vencida, badge "Atrasada" desaparece
  TCard->>TP: onUpdateTask(id, !task.completed)
  TP->>TP: useCallback toggleTask
  TP->>TS: updateTask(userId, taskId, { completed })
  TS->>TS: Agrega updatedAt: Timestamp.now()
  TS->>FS: updateDoc(doc, data)
  alt éxito
    FS-->>TS: ok
    TS-->>TP: ok
    Note over FS,TP: onSnapshot propaga el cambio
    FS-->>TS: snapshot actualizado
    TS-->>TP: task.completed = true/false
    TP->>TP: setTasks(updated)
    TP->>TP: isTaskOverdue(dueDate, completed) → si completada ya no se marca atrasada
    TP-->>U: Checkbox animado + opacidad 60%
  else error
    FS--xTS: FirestoreError
    TS--xTP: lanza excepción
    TP->>FH: getErrorMessage(err)
    TP-->>U: Banner "Error al actualizar tarea: ..."
    Note over TP,TForm: El checkbox vuelve a su estado<br/>anterior (nunca se persisted)
  end

  Note over U,FH: FLUJO ELIMINAR TAREA

  U->>TCard: Click "Eliminar"
  TCard->>TP: onDeleteTask(id)
  TP->>TP: useCallback removeTask
  TP->>TS: deleteTask(userId, taskId)
  TS->>FS: deleteDoc(doc(collection, taskId))
  alt éxito
    FS-->>TS: ok
    Note over FS,TP: onSnapshot propaga<br/>→ tarea desaparece del grid
    FS-->>TS: snapshot sin el doc
    TS-->>TP: onData(remainingTasks)
    TP->>TP: setTasks(remaining)
    TP-->>U: Tarea eliminada del DOM
  else error
    FS--xTS: FirestoreError
    TS--xTP: lanza excepción
    TP->>FH: getErrorMessage(err)
    TP-->>U: Banner "Error al eliminar tarea: ..."
  end
```

---

## 3. Navegación con guards (protección de rutas, redirect, estado preservado)

```mermaid
sequenceDiagram
  actor U as Usuario
  participant Router as React Router
  participant PR as ProtectedRoute
  participant PuR as PublicRoute
  participant AC as AuthContext
  participant FA as Firebase Auth
  participant AP as AuthenticationPage
  participant TP as TasksPage

  Note over U,TP: FLUJO: usuario anónimo intenta /tasks

  U->>Router: Navega a /tasks
  Router->>PR: Renderiza ProtectedRoute
  PR->>AC: useAuth()
  AC-->>PR: { user: null, loading: false }
  PR->>PR: !user → redirect
  PR->>Router: Navigate to="/login"<br/>state={{ from: { pathname: "/tasks" } }}<br/>replace
  Router-->>U: LoginPage

  Note over U,TP: FLUJO: login exitoso con redirect

  U->>AP: Login exitoso
  AP->>Router: navigate(from, { replace: true })
  Note over AP: from = location.state.from.pathname<br/>= "/tasks"
  Router->>PR: Renderiza ProtectedRoute
  PR->>AC: useAuth()
  AC-->>PR: { user: {...}, loading: false }
  PR->>PR: user existe → children
  PR->>TP: Renderiza TasksPage
  TP-->>U: Contenido protegido

  Note over U,TP: FLUJO: usuario autenticado intenta /login

  U->>Router: Navega a /login
  Router->>PuR: Renderiza PublicRoute
  PuR->>AC: useAuth()
  AC-->>PuR: { user: {...}, loading: false }
  PuR->>PuR: user existe → redirect
  PuR->>Router: Navigate to="/tasks" replace
  Router-->>U: TasksPage

  Note over U,TP: FLUJO: recarga con sesión expirada

  U->>Router: Recarga /tasks
  Router->>PR: ProtectedRoute
  PR->>AC: useAuth()
  AC->>FA: onAuthStateChanged (pendiente)
  PR-->>U: Spinner
  alt token expirado / inválido
    FA-->>AC: null
    AC-->>PR: { user: null, loading: false }
    PR->>PR: !user
    PR->>Router: Navigate /login + state.from
    Router-->>U: LoginPage
    Note over Router,AP: state.from = { pathname: "/tasks" }<br/>→ post-login redirect preservado
  else token válido
    FA-->>AC: User
    AC-->>PR: { user: {...}, loading: false }
    PR->>PR: user existe
    PR-->>U: TasksPage
  end
```

---

## 4. Manejo de errores (cadena completa: Firebase → UI)

```mermaid
sequenceDiagram
  participant FA as Firebase
  participant AC as AuthContext
  participant AP as AuthenticationPage
  participant TP as TasksPage
  participant FH as errorHelpers
  participant EB as ErrorBoundary

  Note over FA,EB: ERRORES ESPERADOS (Firebase Auth)

  FA--xAC: FirebaseError { code, message }
  Note over AC: Errores NO se capturan en AuthContext<br/>(se propagan al caller)
  AC--xAP: FirebaseError
  AP->>FH: getErrorCode(err)
  FH->>FH: ¿err es objeto con .code?
  alt tiene .code
    FH-->>AP: "auth/email-already-in-use"
  AP->>AP: ERROR_MESSAGES[code] ?? "Error inesperado..."
  Note over AP: Si code = "auth/too-many-requests"<br/>extrae retryAfter de customData<br/>y agrega "Volvé a intentar en N seg"
  AP-->>U: "Este email ya está registrado"
  else no tiene .code
    FH-->>AP: ""
    AP->>AP: Fallback "Error inesperado. Intenta de nuevo."
    AP-->>U: Error genérico
  end

  Note over FA,EB: ERRORES ESPERADOS (Firestore)

  FA--xTP: FirestoreError (CRUD/suscripción)
  TP->>FH: getErrorMessage(err)
  FH->>FH: ¿err instanceof Error?
  alt es Error
    FH-->>TP: err.message
  else no es Error
    FH-->>TP: String(err)
  end
  TP->>TP: setError("Error al ...: " + mensaje)
  TP-->>U: Banner rojo descartable con Icon alert + X

  Note over FA,EB: ERRORES INESPERADOS (ErrorBoundary)

  Note over TP: Cualquier error no capturado<br/>en el árbol de componentes
  TP--xEB: Error no capturado
  EB->>EB: getDerivedStateFromError(error)
  EB->>EB: state = { error }
  EB-->>U: Pantalla completa:
  Note over EB,U: Icono alerta rojo<br/>"Algo salio mal"<br/>"Ocurrio un error inesperado."<br/>- Botones "Reintentar" y "Recargar pagina"
  U->>EB: Click "Reintentar"
  EB->>EB: handleReset → setState({ error: null })
  Note over EB,U: El árbol se re-renderiza sin recargar la pagina
  U->>EB: Click "Recargar pagina"
  EB->>EB: window.location.reload()
  Note over FA,EB: La app se recarga desde cero

  Note over FA,EB: ERRORES DE INICIALIZACIÓN (Firebase)

  Note over FA: validateFirebaseConfig()
  alt falta VITE_FIREBASE_API_KEY
    FA--xAC: Error "Variable de entorno faltante..."
    Note over FA: Error en tiempo de importación<br/>→ app no arranca
  end

  Note over FA: initializeFirestore() falla (HMR)
  FA--xapp.ts: catch vacío
  app.ts->>app.ts: getFirestore(app) — fallback
  Note over FA,app.ts: No muestra error al usuario,<br/>solo pierde persistencia multi-tab
```

## Resumen de la estrategia de manejo de errores

| Capa                   | Técnica                                        | Respuesta                                                        |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| **AuthContext**        | Sin try/catch, propaga errores                 | El consumidor decide                                             |
| **AuthenticationPage** | `getErrorCode()` + `ERROR_MESSAGES` map        | Mensaje en español en la UI                                      |
| **TasksPage**          | `getErrorMessage()` + `setError()`             | Banner rojo descartable                                          |
| **TaskForm**           | `catch {}` vacío (consume errores)             | Conserva valores del formulario                                  |
| **ErrorBoundary**      | `getDerivedStateFromError()` + `handleReset()` | Pantalla completa con "Reintentar" (remount) y "Recargar página" |
| **Firebase init**      | `try {} catch {}` con fallback                 | Degradación silenciosa                                           |
| **Route guards**       | Spinner + `Navigate`                           | Redirección sin error visible                                    |
