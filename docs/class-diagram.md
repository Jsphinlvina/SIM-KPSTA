# Class Diagram & System Flow — SIM-KPSTA

---

## 1. Domain Model Class Diagram

```mermaid
classDiagram
    direction TB

    class Users {
        +int user_id PK
        +String nim_nip
        +String nama_lengkap
        +String email
        +String role
        +bool is_active
        +bool must_change_password
        +set_password(password)
        +check_password(password) bool
    }

    class PeriodeSemester {
        +int periode_semester_id PK
        +String nama_periode
        +bool status_periode
    }

    class Topik {
        +int topik_id PK
        +String judul
        +String deskripsi
        +String prasyarat
        +int kuota
    }

    class PengajuanKP {
        +int pengajuan_kp_id PK
        +String judul_diajukan
        +String deskripsi_sistem
        +String status_pengajuan
        +String catatan
        +datetime created_at
    }

    class ProsesPenentuan {
        +int proses_id PK
        +String status
        +String tahap_chain
        +String catatan_penolakan
        +datetime created_at
        +datetime updated_at
    }

    class BimbinganAktif {
        +int bimbingan_id PK
        +datetime created_at
    }

    class Document {
        +int id PK
        +int bimbingan_aktif_id FK
        +int uploaded_by FK
        +String document_type
        +String file_name
        +String file_url
        +String status
        +String rejection_reason
    }

    class ScheduleEvent {
        +int id PK
        +int bimbingan_aktif_id FK
        +int lecturer_id FK
        +int student_id FK
        +int coordinator_id FK
        +String event_type
        +date date
        +time time
        +String location
        +String meeting_link
        +String status
    }

    class Notification {
        +int id PK
        +int user_id FK
        +String notification_type
        +String message
        +bool is_read
        +datetime created_at
    }

    class ArchiveRecord {
        +int id PK
        +String source_type
        +int source_id
        +String title
        +int student_id FK
        +int lecturer_id FK
        +String state
        +datetime created_at
    }

    Users "1" --> "0..*" Topik : creates (dosen)
    Users "1" --> "0..*" PengajuanKP : submits (mahasiswa)
    Users "1" --> "0..*" BimbinganAktif : as mahasiswa
    Users "1" --> "0..*" BimbinganAktif : as dosen
    Users "1" --> "0..*" ProsesPenentuan : dosen_diusulkan
    PeriodeSemester "1" --> "0..*" Topik : periode
    PeriodeSemester "1" --> "0..*" PengajuanKP : periode
    Topik "0..1" --> "0..*" PengajuanKP : topik (nullable)
    PengajuanKP "1" --> "0..1" ProsesPenentuan : proses_penentuan
    PengajuanKP "1" --> "0..1" BimbinganAktif : bimbingan_aktif
    BimbinganAktif "1" --> "0..*" Document : bimbingan_aktif_id
    BimbinganAktif "1" --> "0..*" ScheduleEvent : bimbingan_aktif_id
    Users "1" --> "0..*" Notification : user_id
```

---

## 2. Design Patterns Class Diagram

### 2a. Factory Pattern — Pengajuan Creation

```mermaid
classDiagram
    direction TB

    class PengajuanFactory {
        <<abstract>>
        +create_pengajuan(data, mahasiswa_user) PengajuanKP*
    }

    class PengajuanTopikDosenFactory {
        +create_pengajuan(data, mahasiswa_user) PengajuanKP
    }

    class PengajuanMandiriFactory {
        +create_pengajuan(data, mahasiswa_user) PengajuanKP
    }

    class PengajuanValidator {
        +validate_topik_dosen(topik_id) Topik$
        +validate_mandiri(judul, deskripsi)$
    }

    class PengajuanService {
        -PengajuanKP instance
        -PengajuanState state
        +__init__(instance)
        +trigger_submit()
        +trigger_approve()
        +trigger_reject(catatan)
        +trigger_revise(catatan)
        +create_pengajuan(data, user)$
        +create_via_factory(tipe, data, user)$
        +get_riwayat_mahasiswa(mhs_id)$
        +get_all_pengajuan()$
    }

    PengajuanFactory <|-- PengajuanTopikDosenFactory : extends
    PengajuanFactory <|-- PengajuanMandiriFactory : extends
    PengajuanTopikDosenFactory ..> PengajuanValidator : uses
    PengajuanMandiriFactory ..> PengajuanValidator : uses
    PengajuanService ..> PengajuanTopikDosenFactory : creates
    PengajuanService ..> PengajuanMandiriFactory : creates
```

### 2b. State Pattern — PengajuanKP Status

```mermaid
classDiagram
    direction TB

    class PengajuanState {
        <<abstract>>
        +submit(context)*
        +approve(context)*
        +reject(context)*
        +revise(context)*
    }

    class DraftState {
        +submit(context)
        +approve(context)
        +reject(context)
        +revise(context)
    }

    class SubmittedState {
        +submit(context)
        +approve(context)
        +reject(context)
        +revise(context)
    }

    class ApprovedState {
        +submit(context)
        +approve(context)
        +reject(context)
        +revise(context)
    }

    class RejectedState {
        +submit(context)
        +approve(context)
        +reject(context)
        +revise(context)
    }

    class PengajuanService {
        -PengajuanKP instance
        -PengajuanState state
        +_load_state()
        +trigger_submit()
        +trigger_approve()
        +trigger_reject(catatan)
        +trigger_revise(catatan)
    }

    PengajuanState <|-- DraftState : extends
    PengajuanState <|-- SubmittedState : extends
    PengajuanState <|-- ApprovedState : extends
    PengajuanState <|-- RejectedState : extends
    PengajuanService --> PengajuanState : state
```

### 2c. State Pattern — ProsesPenentuan Approval

```mermaid
classDiagram
    direction TB

    class PenentuanState {
        <<abstract>>
        +handle_approve(context)*
        +handle_reject(context, catatan)*
    }

    class MenungguState {
        +handle_approve(context)
        +handle_reject(context, catatan)
    }

    class DisetujuiState {
        +handle_approve(context)
        +handle_reject(context, catatan)
    }

    class DitolakState {
        +handle_approve(context)
        +handle_reject(context, catatan)
    }

    class BimbinganService {
        -ProsesPenentuan proses
        -PenentuanState state
        +__init__(proses_instance)
        +set_state_by_status()
        +execute_approve_step(user)
        +execute_reject_step(user, alasan)
        +start_approval_chain(pengajuan, dosen)$
    }

    PenentuanState <|-- MenungguState : extends
    PenentuanState <|-- DisetujuiState : extends
    PenentuanState <|-- DitolakState : extends
    BimbinganService --> PenentuanState : state
```

### 2d. Chain of Responsibility — Approval Chain

```mermaid
classDiagram
    direction LR

    class ApprovalHandler {
        <<abstract>>
        -ApprovalHandler next_handler
        +set_next(handler) ApprovalHandler
        +handle(context, user) bool*
    }

    class KoordinatorKPHandler {
        +handle(context, user) bool
    }

    class DosenPembimbingHandler {
        +handle(context, user) bool
    }

    class KetuaProdiHandler {
        +handle(context, user) bool
    }

    ApprovalHandler <|-- KoordinatorKPHandler : extends
    ApprovalHandler <|-- DosenPembimbingHandler : extends
    ApprovalHandler <|-- KetuaProdiHandler : extends
    ApprovalHandler --> ApprovalHandler : next_handler
```

### 2e. Singleton Pattern — AuthSession

```mermaid
classDiagram
    direction TB

    class AuthSession {
        -AuthSession _instance$
        -Users _current_user
        +__new__() AuthSession$
        +set_session(user)
        +get_user() Users
        +clear_session()
    }

    class AuthService {
        +authenticate_user(nim_nip, password) dict$
    }

    class UserService {
        +get_all_users() QuerySet$
        +get_user_by_id(id) Users$
        +register_user(data) Users$
        +get_pending_users() QuerySet$
        +approve_user(id, role) Users$
        +reset_password(id) bool$
        +change_password(id, password) bool$
        +delete_user(id) bool$
        +update_user(id, data) Users$
    }

    AuthService ..> AuthSession : updates
```

---

## 3. System Flow

### 3a. User Registration & Approval

```mermaid
flowchart TD
    A([User]) -->|POST /auth/register/| B[UserService.register_user]
    B --> C[Create Users\nis_active = False]
    C --> D([Admin])
    D -->|GET /auth/pending/| E[List pending users]
    E -->|POST /auth/id/approve/| F[UserService.approve_user]
    F --> G[Set is_active = True\nAssign role]
    G --> H([User can log in])
```

### 3b. Login Flow

```mermaid
flowchart TD
    A([User]) -->|POST /auth/login/| B{AuthController.login}
    B -->|validate| C[LoginSerializer]
    C --> D[AuthService.authenticate_user]
    D --> E{User found?}
    E -->|No| F[Return USER_NOT_FOUND 401]
    E -->|Yes| G{is_active?}
    G -->|No| H[Return PENDING_APPROVAL 401]
    G -->|Yes| I{Password correct?}
    I -->|No| J[Return WRONG_PASSWORD 401]
    I -->|Yes| K[Generate JWT tokens]
    K --> L[AuthSession.set_session]
    L --> M[Return access_token + user]
    M --> N([Frontend stores token\nRedirects by role])
```

### 3c. Mahasiswa Submits Dosen's Topic

```mermaid
flowchart TD
    A([Mahasiswa]) -->|GET /topik/| B[Browse topic list]
    B -->|POST /pengajuan/topik-dosen/| C[PengajuanService.create_via_factory]
    C --> D[PengajuanTopikDosenFactory]
    D --> E[PengajuanValidator.validate_topik_dosen]
    E -->|kuota = 0| F[Raise ValidationError]
    E -->|kuota > 0| G[Create PengajuanKP\nstatus = submitted]
    G --> H[Create ProsesPenentuan\nstatus = menunggu\ntahap_chain = dosen]
    H --> I([Dosen])
    I -->|GET /bimbingan/pending-approval/| J[See pending list]
    J -->|POST /bimbingan/id/check-approval/| K[BimbinganService.execute_approve_step]
    K --> L[DosenPembimbingHandler.handle]
    L --> M{kuota > 0?}
    M -->|No| N[Raise Exception — quota habis]
    M -->|Yes| O[MenungguState.handle_approve]
    O --> P[ProsesPenentuan\nstatus = disetujui\ntahap_chain = selesai]
    P --> Q[Create BimbinganAktif]
    Q --> R[PengajuanKP\nstatus = approved]
    R --> S[Topik kuota -= 1]
```

### 3d. Mahasiswa Submits Mandiri Topic → Koordinator Assigns Dosen

```mermaid
flowchart TD
    A([Mahasiswa]) -->|POST /pengajuan/mandiri/| B[PengajuanService.create_via_factory]
    B --> C[PengajuanMandiriFactory]
    C --> D[PengajuanValidator.validate_mandiri]
    D --> E[Get active PeriodeSemester]
    E --> F[Create PengajuanKP\ntopik = null\nstatus = submitted]
    F --> G([Koordinator])
    G -->|GET /pengajuan/ — filter submitted, no topik, no has_proses| H[See unassigned mandiri list]
    H -->|POST /bimbingan/start-process/id/| I[BimbinganService.start_approval_chain]
    I --> J[Create ProsesPenentuan\nstatus = menunggu\ntahap_chain = dosen]
    J --> K([Dosen])
    K -->|GET /bimbingan/pending-approval/| L[See pending list]
    L -->|POST /bimbingan/id/check-approval/| M[BimbinganService.execute_approve_step]
    M --> N[DosenPembimbingHandler.handle]
    N --> O[Create BimbinganAktif]
    O --> P[PengajuanKP status = approved]
```

### 3e. Active Bimbingan — Document & Schedule

```mermaid
flowchart TD
    A([BimbinganAktif Created]) --> B([Mahasiswa])
    B -->|POST /document/| C[Upload Document\nstatus = uploaded]
    C --> D([Dosen])
    D -->|PUT /document/id/| E{Review}
    E -->|verified| F[Document status = verified]
    E -->|rejected| G[Document status = rejected\nrejection_reason set]

    A --> H([Koordinator])
    H -->|POST /defense/| I[Create ScheduleEvent\nevent_type = defense]
    I --> J[ScheduleEvent status = scheduled]
    J --> K{Event day}
    K -->|ongoing| L[status = ongoing]
    K -->|done| M[status = completed]
    M --> N[ArchiveRecord created\nsource_type = schedule]
```

---

## 4. Summary — Class Relationships

```mermaid
classDiagram
    direction TB

    class Users
    class PeriodeSemester
    class Topik
    class PengajuanKP
    class ProsesPenentuan
    class BimbinganAktif
    class Document
    class ScheduleEvent
    class Notification
    class ArchiveRecord

    class PengajuanFactory
    class PengajuanService
    class BimbinganService
    class AuthService
    class UserService
    class AuthSession

    Users "1" --> "0..*" Topik : dosen creates
    Users "1" --> "0..*" PengajuanKP : mahasiswa submits
    Users "1" --> "0..*" BimbinganAktif : mahasiswa / dosen
    Users "1" --> "0..*" ProsesPenentuan : dosen_diusulkan
    PeriodeSemester "1" --> "0..*" Topik
    PeriodeSemester "1" --> "0..*" PengajuanKP
    Topik "0..1" --> "0..*" PengajuanKP
    PengajuanKP "1" --> "0..1" ProsesPenentuan
    PengajuanKP "1" --> "0..1" BimbinganAktif
    BimbinganAktif "1" --> "0..*" Document
    BimbinganAktif "1" --> "0..*" ScheduleEvent
    ScheduleEvent --> ArchiveRecord : archived as
    Document --> ArchiveRecord : archived as

    PengajuanService ..> PengajuanFactory : delegates to
    PengajuanService --> PengajuanKP : manages
    BimbinganService --> ProsesPenentuan : manages
    BimbinganService ..> BimbinganAktif : creates
    AuthService ..> Users : authenticates
    AuthService ..> AuthSession : updates
    UserService ..> Users : manages
```
