<!-- SCENARIOS_META
{
  "version": "1.0",
  "project": "ChessTourism",
  "generated": "2026-04-07",
  "total": 57,
  "groups": {
    "structural": 20,
    "interactive": 17,
    "cross_portal": 5,
    "admin": 5,
    "security": 10,
    "visual": 5
  },
  "dependency_groups": {
    "tier1_auth": ["inter-001"],
    "tier2_participant": ["inter-002", "inter-003", "inter-004", "inter-005", "cross-001", "cross-002", "cross-003"],
    "tier2_commissioner": ["inter-006", "inter-007", "inter-008", "inter-009", "inter-010", "inter-014"],
    "tier2_admin": ["admin-001", "admin-002", "admin-003", "admin-004"],
    "independent": ["path-*", "sec-*", "vis-*"]
  },
  "scenarios": [
    {
      "id": "path-001",
      "title": "Главная страница открывается",
      "uc_ref": "UC-25",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/",
      "steps": [
        "Открыть /",
        "Проверить наличие Hero секции с CTA 'Upcoming Tournaments'",
        "Проверить секцию ближайших турниров (до 4 карточек)",
        "Проверить секцию Топ рейтинга (10 позиций)",
        "Проверить секцию 'How It Works' (4 шага)",
        "Проверить CTA карточки 'Become a Commissar' и 'Host a Tournament'"
      ],
      "expected": "Все секции отображаются, данные загружены, CTA кнопки ведут на публичные страницы",
      "priority": "p1"
    },
    {
      "id": "path-002",
      "title": "Каталог турниров открывается",
      "uc_ref": "UC-27",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/tournaments",
      "steps": [
        "Открыть /tournaments",
        "Проверить наличие списка турниров (карточки)",
        "Проверить фильтры: страна, тип контроля, статус",
        "Проверить пагинацию",
        "Проверить что DRAFT турниры не отображаются"
      ],
      "expected": "Список опубликованных турниров с фильтрами и пагинацией отображается",
      "priority": "p1"
    },
    {
      "id": "path-003",
      "title": "Страница турнира открывается",
      "uc_ref": "UC-24",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/tournaments/:id",
      "steps": [
        "Открыть /tournaments/:id существующего турнира",
        "Проверить заголовок, даты, город, страна, формат, взнос",
        "Проверить статус badge",
        "Проверить табы: info / participants / results / photos",
        "Проверить OG meta теги (og:title, og:description)"
      ],
      "expected": "Полная карточка турнира с табами, данные загружены, OG теги присутствуют",
      "priority": "p1"
    },
    {
      "id": "path-004",
      "title": "Каталог комиссаров открывается",
      "uc_ref": "UC-29",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/commissars",
      "steps": [
        "Открыть /commissars",
        "Проверить карточки верифицированных комиссаров",
        "Проверить фильтр по стране",
        "Проверить данные: фото, имя, страна, город, кол-во турниров"
      ],
      "expected": "Карточки комиссаров отображаются с фильтрацией по стране",
      "priority": "p2"
    },
    {
      "id": "path-005",
      "title": "Страница комиссара открывается",
      "uc_ref": "UC-14",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/commissars/:id",
      "steps": [
        "Открыть /commissars/:id верифицированного комиссара",
        "Проверить фото, ФИО, биографию",
        "Проверить статистику: проведённых турниров, участников",
        "Проверить список последних турниров"
      ],
      "expected": "Публичный профиль комиссара с данными и статистикой",
      "priority": "p2"
    },
    {
      "id": "path-006",
      "title": "Публичный профиль пользователя открывается",
      "uc_ref": "UC-33",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/users/:id",
      "steps": [
        "Открыть /users/:id существующего пользователя",
        "Проверить имя, страну, рейтинг",
        "Проверить историю турниров (завершённые)",
        "Проверить что email и phone НЕ показываются"
      ],
      "expected": "Публичный профиль без приватных данных, история турниров отображается",
      "priority": "p2"
    },
    {
      "id": "path-007",
      "title": "Рейтинг-лист открывается",
      "uc_ref": "UC-17",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/ratings",
      "steps": [
        "Открыть /ratings",
        "Проверить таблицу: #, ФИО, Страна, Рейтинг, Турниров, Динамика",
        "Проверить сортировку по рейтингу (высший первый)",
        "Проверить фильтр по стране и поиск по имени",
        "Проверить пагинацию (50 на страницу)"
      ],
      "expected": "Таблица рейтинга с фильтрами и пагинацией отображается",
      "priority": "p1"
    },
    {
      "id": "path-008",
      "title": "История рейтинга открывается",
      "uc_ref": "UC-26",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/ratings/history",
      "steps": [
        "Открыть /ratings/history",
        "Проверить таблицу: турнир, место, очки, изменение ELO, дата",
        "Проверить пагинацию"
      ],
      "expected": "Таблица истории рейтинга с пагинацией",
      "priority": "p3"
    },
    {
      "id": "path-009",
      "title": "Заявка организации открывается",
      "uc_ref": "UC-15",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/organizations/apply",
      "steps": [
        "Открыть /organizations/apply",
        "Проверить форму: название организации, тип, контактное лицо, email, описание",
        "Проверить кнопку 'Отправить заявку'"
      ],
      "expected": "Форма заявки организации доступна без авторизации",
      "priority": "p2"
    },
    {
      "id": "path-010",
      "title": "Проверка сертификата открывается",
      "uc_ref": "UC-05",
      "type": "structural",
      "actor": "guest",
      "status": "[ ]",
      "path": "/verify/:id",
      "steps": [
        "Открыть /verify/:id с валидным certificate ID",
        "Проверить данные сертификата: номер, имя участника, дата"
      ],
      "expected": "Публичная страница верификации сертификата отображает данные",
      "priority": "p3"
    },
    {
      "id": "path-011",
      "title": "Страница успешной оплаты открывается",
      "uc_ref": "UC-10",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/payment-success",
      "steps": [
        "Открыть /payment-success?tournamentId=:id",
        "Проверить сообщение об успешной оплате"
      ],
      "expected": "Страница показывает подтверждение оплаты",
      "priority": "p2"
    },
    {
      "id": "path-012",
      "title": "Dashboard участника открывается",
      "uc_ref": "UC-04",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard)",
        "Проверить блок Профиль: ФИО, страна, FIDE ID",
        "Проверить блок Рейтинг: число + позиция",
        "Проверить блок Турниры: количество, последний",
        "Проверить что блок Членство скрыт (deferred v2)"
      ],
      "expected": "Dashboard загружается с актуальными данными, блок членства скрыт",
      "priority": "p1"
    },
    {
      "id": "path-013",
      "title": "Мой профиль открывается",
      "uc_ref": "UC-01",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/profile",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard)/profile",
        "Проверить поля: Имя, Фамилия, Страна, Дата рождения, FIDE ID",
        "Проверить что Email read-only"
      ],
      "expected": "Форма профиля с предзаполненными данными, email disabled",
      "priority": "p1"
    },
    {
      "id": "path-014",
      "title": "Мои регистрации открывается",
      "uc_ref": "UC-32",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/my-registrations",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard)/my-registrations",
        "Проверить список регистраций с данными турнира и статусами",
        "Проверить что кнопка отмены отсутствует (no-cancel policy)"
      ],
      "expected": "Список регистраций без кнопки отмены",
      "priority": "p2"
    },
    {
      "id": "path-015",
      "title": "Watchlist открывается",
      "uc_ref": "UC-20",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/watchlist",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard)/watchlist",
        "Проверить список отслеживаемых турниров или пустое состояние"
      ],
      "expected": "Список watchlist турниров или сообщение 'Нет отслеживаемых турниров'",
      "priority": "p2"
    },
    {
      "id": "path-016",
      "title": "Уведомления открываются",
      "uc_ref": "UC-21",
      "type": "structural",
      "actor": "participant",
      "status": "[ ]",
      "path": "/notifications",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /notifications",
        "Проверить список уведомлений или пустое состояние",
        "Проверить badge непрочитанных"
      ],
      "expected": "Список уведомлений с badge количества непрочитанных",
      "priority": "p2"
    },
    {
      "id": "path-017",
      "title": "Создание турнира открывается",
      "uc_ref": "UC-06",
      "type": "structural",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/create",
      "steps": [
        "Авторизоваться как верифицированный комиссар",
        "Открыть /(dashboard)/tournaments/create",
        "Проверить форму: название, место, даты, формат, описание, взнос, макс. участников"
      ],
      "expected": "Форма создания турнира со всеми полями",
      "priority": "p1"
    },
    {
      "id": "path-018",
      "title": "Управление турнирами комиссара открывается",
      "uc_ref": "UC-31",
      "type": "structural",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/manage",
      "steps": [
        "Авторизоваться как комиссар",
        "Открыть /(dashboard)/tournaments/manage",
        "Проверить список турниров с фильтром по статусу",
        "Проверить быстрые действия: Publish / Start / Complete / Cancel"
      ],
      "expected": "Список турниров комиссара с действиями по управлению статусом",
      "priority": "p1"
    },
    {
      "id": "path-019",
      "title": "Admin Dashboard открывается",
      "uc_ref": "UC-30",
      "type": "structural",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)",
        "Проверить счётчики: заявки участников, комиссаров, организаций",
        "Проверить навигацию: users, tournaments, finances, organizations, moderation"
      ],
      "expected": "Admin dashboard с актуальными счётчиками и навигацией",
      "priority": "p1"
    },
    {
      "id": "path-020",
      "title": "Admin Finances открывается",
      "uc_ref": "UC-35",
      "type": "structural",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/finances",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)/finances",
        "Проверить 4 summary-карточки: Total Revenue, Paid Count, Pending, Refunds+Disputes",
        "Проверить фильтр по периоду",
        "Проверить paginated список транзакций"
      ],
      "expected": "Финансовая панель с карточками и списком транзакций",
      "priority": "p2"
    },
    {
      "id": "inter-001",
      "title": "OTP auth flow: email -> код -> вход",
      "uc_ref": "UC-00",
      "type": "interactive",
      "actor": "guest",
      "status": "[ ]",
      "path": "/(auth)/login",
      "steps": [
        "Открыть /(auth)/login",
        "Ввести email в поле",
        "Нажать 'Get Code'",
        "Проверить переход на экран OTP",
        "Ввести код 000000 (dev mode)",
        "Нажать 'Войти'",
        "Проверить редирект в dashboard или на /profile (если onboarding не пройден)"
      ],
      "expected": "Успешный вход, JWT токены установлены, редирект в кабинет",
      "priority": "p1"
    },
    {
      "id": "inter-002",
      "title": "Заполнение профиля участника",
      "uc_ref": "UC-01",
      "type": "interactive",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/profile",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard)/profile",
        "Заполнить Имя, Фамилию, Страну",
        "Нажать 'Сохранить'",
        "Проверить тост 'Профиль сохранён'",
        "Перезагрузить страницу — данные сохранены"
      ],
      "expected": "Профиль сохранён через PUT /api/users/me, данные персистентны",
      "priority": "p1"
    },
    {
      "id": "inter-003",
      "title": "Регистрация на бесплатный турнир",
      "uc_ref": "UC-28",
      "type": "interactive",
      "actor": "participant",
      "status": "[ ]",
      "path": "/tournaments/:id",
      "steps": [
        "Авторизоваться как участник",
        "Открыть страницу бесплатного турнира (fee=0) со статусом REGISTRATION_OPEN",
        "Нажать 'Зарегистрироваться'",
        "Проверить что статус регистрации = PAID (auto-confirm для бесплатных)",
        "Проверить появление в /(dashboard)/my-registrations"
      ],
      "expected": "Регистрация создана со статусом PAID, видна в 'Мои регистрации'",
      "priority": "p1"
    },
    {
      "id": "inter-004",
      "title": "Регистрация на платный турнир + оплата",
      "uc_ref": "UC-28, UC-10",
      "type": "interactive",
      "actor": "participant",
      "status": "[ ]",
      "path": "/tournaments/:id",
      "steps": [
        "Авторизоваться как участник",
        "Открыть страницу платного турнира со статусом REGISTRATION_OPEN",
        "Нажать 'Зарегистрироваться'",
        "Проверить статус PENDING",
        "Проверить редирект на страницу оплаты",
        "Пройти Stripe Checkout (тестовые данные)",
        "Проверить статус = PAID после оплаты"
      ],
      "expected": "Регистрация PENDING -> оплата через Stripe -> статус PAID",
      "priority": "p1"
    },
    {
      "id": "inter-005",
      "title": "Добавление и удаление из watchlist",
      "uc_ref": "UC-20",
      "type": "interactive",
      "actor": "participant",
      "status": "[ ]",
      "path": "/tournaments/:id",
      "steps": [
        "Авторизоваться как участник",
        "Открыть страницу турнира",
        "Нажать heart icon (добавить в watchlist)",
        "Проверить что иконка стала заполненной",
        "Открыть /(dashboard)/watchlist — турнир в списке",
        "Нажать heart icon повторно (удалить)",
        "Проверить что турнир удалён из watchlist"
      ],
      "expected": "Toggle watchlist работает, данные синхронизированы с /api/watchlist",
      "priority": "p2"
    },
    {
      "id": "inter-006",
      "title": "Подача заявки комиссара",
      "uc_ref": "UC-02",
      "type": "interactive",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/commissioner",
      "steps": [
        "Авторизоваться как участник",
        "Перейти на страницу 'Стать комиссаром'",
        "Заполнить: опыт (min 50 символов), регион, локации (до 3)",
        "Нажать 'Подать заявку'",
        "Проверить сообщение 'Заявка отправлена. Ожидайте рассмотрения'"
      ],
      "expected": "Заявка создана со статусом commissioner_pending, admin получает уведомление",
      "priority": "p1"
    },
    {
      "id": "inter-007",
      "title": "Создание турнира комиссаром",
      "uc_ref": "UC-06",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/create",
      "steps": [
        "Авторизоваться как верифицированный комиссар",
        "Открыть форму создания турнира",
        "Заполнить: название, место, даты, формат",
        "Нажать 'Создать турнир'",
        "Проверить статус DRAFT",
        "Проверить что турнир НЕ виден публично"
      ],
      "expected": "Турнир создан со статусом DRAFT, виден только комиссару",
      "priority": "p1"
    },
    {
      "id": "inter-008",
      "title": "Редактирование турнира",
      "uc_ref": "UC-06, UC-NEW-05",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/edit",
      "steps": [
        "Авторизоваться как комиссар-владелец",
        "Открыть /(dashboard)/tournaments/:id/edit",
        "Изменить название и описание",
        "Нажать 'Сохранить'",
        "Проверить что данные обновились"
      ],
      "expected": "Турнир обновлён, изменения отражены на публичной странице",
      "priority": "p2"
    },
    {
      "id": "inter-009",
      "title": "Публикация турнира (state machine)",
      "uc_ref": "UC-NEW-05",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/manage",
      "steps": [
        "Авторизоваться как комиссар",
        "Найти турнир в статусе DRAFT",
        "Нажать 'Опубликовать' -> PUBLISHED",
        "Нажать 'Открыть регистрацию' -> REGISTRATION_OPEN",
        "Проверить что турнир виден на /tournaments"
      ],
      "expected": "Переходы DRAFT->PUBLISHED->REGISTRATION_OPEN выполнены, турнир публичный",
      "priority": "p1"
    },
    {
      "id": "inter-010",
      "title": "Одобрение регистрации комиссаром",
      "uc_ref": "UC-07",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/registrations",
      "steps": [
        "Авторизоваться как комиссар-владелец",
        "Открыть вкладку 'Участники'",
        "Найти регистрацию со статусом PENDING",
        "Нажать 'Одобрить'",
        "Проверить статус APPROVED (платный) или PAID (бесплатный)"
      ],
      "expected": "Регистрация одобрена, участник получает уведомление",
      "priority": "p1"
    },
    {
      "id": "inter-011",
      "title": "Загрузка фото турнира",
      "uc_ref": "UC-09",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/photos",
      "steps": [
        "Авторизоваться как комиссар-владелец завершённого турнира",
        "Открыть вкладку 'Фото'",
        "Загрузить JPG фото (< 10MB)",
        "Проверить что фото появилось в галерее",
        "Проверить что фото видно на публичной странице"
      ],
      "expected": "Фото загружено в S3/MinIO, отображается публично",
      "priority": "p2"
    },
    {
      "id": "inter-012",
      "title": "Ввод результатов турнира",
      "uc_ref": "UC-23",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/results",
      "steps": [
        "Авторизоваться как комиссар-владелец",
        "Открыть турнир со статусом IN_PROGRESS",
        "Ввести результаты: место и очки для каждого участника",
        "Нажать 'Утвердить результаты'",
        "Проверить ELO изменения рассчитаны",
        "Проверить статус -> COMPLETED"
      ],
      "expected": "Результаты сохранены, ELO обновлён, турнир COMPLETED",
      "priority": "p1"
    },
    {
      "id": "inter-013",
      "title": "Подача заявки от организации",
      "uc_ref": "UC-15",
      "type": "interactive",
      "actor": "guest",
      "status": "[ ]",
      "path": "/organizations/apply",
      "steps": [
        "Открыть /organizations/apply без авторизации",
        "Заполнить: название организации, контактное лицо, email, описание (min 30 символов)",
        "Нажать 'Отправить заявку'",
        "Проверить сообщение 'Спасибо! Ваша заявка принята'"
      ],
      "expected": "Заявка создана, admin получает email уведомление",
      "priority": "p2"
    },
    {
      "id": "inter-014",
      "title": "Редактирование профиля комиссара",
      "uc_ref": "UC-NEW-07",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/commissioner/edit",
      "steps": [
        "Авторизоваться как комиссар",
        "Открыть /(dashboard)/commissioner/edit",
        "Обновить bio, города работы, достижения",
        "Загрузить аватар (JPG/PNG, < 5MB)",
        "Нажать 'Сохранить'",
        "Проверить изменения на публичной странице /commissars/:id"
      ],
      "expected": "Профиль комиссара обновлён, изменения видны публично",
      "priority": "p2"
    },
    {
      "id": "inter-015",
      "title": "Создание расписания турнира",
      "uc_ref": "UC-NEW-10",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[x]",
      "path": "/(dashboard)/tournaments/:id/schedule",
      "steps": [
        "Авторизоваться как комиссар-владелец",
        "Открыть dashboard турнира -> 'Расписание'",
        "Добавить событие: название, дата/время, тип",
        "Проверить хронологический список",
        "Проверить на публичной странице таб 'Расписание'"
      ],
      "expected": "Расписание создано, видно публично",
      "priority": "p2"
    },
    {
      "id": "inter-016",
      "title": "Публикация объявления турнира",
      "uc_ref": "UC-NEW-11",
      "type": "interactive",
      "actor": "commissioner",
      "status": "[x]",
      "path": "/tournaments/:id/announcements",
      "steps": [
        "Авторизоваться как комиссар",
        "Открыть dashboard турнира -> 'Объявления'",
        "Написать текст объявления (до 1000 симв.)",
        "Нажать 'Опубликовать'",
        "Проверить что объявление видно публично",
        "Проверить что участники получили уведомление"
      ],
      "expected": "Объявление опубликовано, email + in-app уведомления отправлены",
      "priority": "p2"
    },
    {
      "id": "inter-017",
      "title": "Просмотр истории рейтинга",
      "uc_ref": "UC-26",
      "type": "interactive",
      "actor": "guest",
      "status": "[ ]",
      "path": "/ratings/history",
      "steps": [
        "Открыть /ratings",
        "Нажать 'View History' у участника",
        "Проверить таблицу: турнир, место, очки, ELO дельта, дата",
        "Проверить пагинацию"
      ],
      "expected": "История рейтинга с дельтами и пагинацией",
      "priority": "p3"
    },
    {
      "id": "cross-001",
      "title": "Участник регистрируется -> Комиссар видит",
      "uc_ref": "UC-07, UC-28",
      "type": "cross-portal",
      "actor": "participant",
      "status": "[ ]",
      "path": "/tournaments/:id",
      "steps": [
        "Участник регистрируется на турнир (UC-28)",
        "Комиссар открывает вкладку 'Участники' того же турнира",
        "Проверить что новая регистрация видна в списке"
      ],
      "expected": "Регистрация участника мгновенно видна комиссару",
      "priority": "p1"
    },
    {
      "id": "cross-002",
      "title": "Комиссар одобряет -> Участник получает уведомление",
      "uc_ref": "UC-07, UC-21",
      "type": "cross-portal",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/registrations",
      "steps": [
        "Комиссар одобряет регистрацию участника",
        "Участник открывает /notifications",
        "Проверить уведомление 'Заявка одобрена'"
      ],
      "expected": "In-app уведомление REGISTRATION_APPROVED создано и видно участнику",
      "priority": "p1"
    },
    {
      "id": "cross-003",
      "title": "Участник платит онлайн -> Регистрация PAID",
      "uc_ref": "UC-10, SYS-04",
      "type": "cross-portal",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)/payment/:tournamentId",
      "steps": [
        "Участник оплачивает через Stripe Checkout",
        "Stripe webhook (checkout.session.completed) приходит",
        "Проверить registration.status = PAID",
        "Комиссар видит обновлённый статус оплаты"
      ],
      "expected": "Webhook обрабатывает оплату, статус PAID, виден обоим актёрам",
      "priority": "p1"
    },
    {
      "id": "cross-004",
      "title": "Комиссар вводит результаты -> ELO обновляется",
      "uc_ref": "UC-23, SYS-02",
      "type": "cross-portal",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/:id/results",
      "steps": [
        "Комиссар вводит результаты и утверждает",
        "Проверить ELO изменения в /ratings",
        "Участник видит обновлённый рейтинг в dashboard",
        "Проверить историю рейтинга /ratings/history"
      ],
      "expected": "ELO пересчитан, виден в рейтинг-листе и профиле участника",
      "priority": "p1"
    },
    {
      "id": "cross-005",
      "title": "Комиссар отменяет турнир -> Участники уведомлены",
      "uc_ref": "UC-NEW-01, UC-21",
      "type": "cross-portal",
      "actor": "commissioner",
      "status": "[ ]",
      "path": "/(dashboard)/tournaments/manage",
      "steps": [
        "Комиссар нажимает 'Отменить турнир'",
        "Подтверждает в confirmation dialog",
        "Проверить статус -> CANCELLED",
        "Проверить что все регистрации -> CANCELLED",
        "Участники получают email и in-app уведомление"
      ],
      "expected": "Турнир и регистрации отменены, участники уведомлены по email и in-app",
      "priority": "p2"
    },
    {
      "id": "admin-001",
      "title": "Модерация заявки комиссара",
      "uc_ref": "UC-16",
      "type": "admin",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/moderation",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)/moderation",
        "Найти заявку комиссара со статусом pending",
        "Нажать 'Одобрить'",
        "Проверить роль пользователя = commissioner",
        "Проверить email отправлен: 'Вы аккредитованы как комиссар'"
      ],
      "expected": "Заявка одобрена, роль обновлена, email отправлен",
      "priority": "p1"
    },
    {
      "id": "admin-002",
      "title": "Управление пользователями — смена роли",
      "uc_ref": "UC-30",
      "type": "admin",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/users",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)/users",
        "Найти пользователя по email",
        "Изменить роль через PATCH /api/admin/users/:id",
        "Проверить что роль обновилась"
      ],
      "expected": "Роль пользователя изменена через admin панель",
      "priority": "p2"
    },
    {
      "id": "admin-003",
      "title": "Модерация organization requests",
      "uc_ref": "UC-16",
      "type": "admin",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/organizations",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)/organizations",
        "Найти заявку организации",
        "Одобрить или отклонить",
        "Проверить email организации с решением"
      ],
      "expected": "Заявка обработана, email отправлен организации",
      "priority": "p2"
    },
    {
      "id": "admin-004",
      "title": "Просмотр финансов",
      "uc_ref": "UC-35",
      "type": "admin",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/finances",
      "steps": [
        "Авторизоваться как admin",
        "Открыть /(admin)/finances",
        "Проверить summary: Total Revenue, Paid Count, Pending, Refunds+Disputes",
        "Сменить период фильтрации",
        "Проверить обновление карточек и списка транзакций"
      ],
      "expected": "Финансовые данные корректны, фильтр по периоду работает",
      "priority": "p2"
    },
    {
      "id": "admin-005",
      "title": "Разрешение dispute/chargeback",
      "uc_ref": "SYS-06",
      "type": "admin",
      "actor": "admin",
      "status": "[ ]",
      "path": "/(admin)/finances",
      "steps": [
        "Симулировать charge.dispute.created webhook",
        "Проверить payment.status = DISPUTED",
        "Проверить in-app уведомление admin 'PAYMENT_DISPUTED'",
        "Проверить DISPUTED badge в таблице финансов"
      ],
      "expected": "Dispute зафиксирован, admin уведомлён, виден в /admin/finances",
      "priority": "p3"
    },
    {
      "id": "sec-001",
      "title": "Защищённые роуты без токена -> 401",
      "uc_ref": "UC-00",
      "type": "security",
      "actor": "guest",
      "status": "[ ]",
      "path": "/api/profile/registrations",
      "steps": [
        "Отправить GET /api/profile/registrations без Authorization header",
        "Проверить HTTP 401"
      ],
      "expected": "401 Unauthorized без валидного токена",
      "priority": "p1"
    },
    {
      "id": "sec-002",
      "title": "Admin endpoint с user токеном -> 403",
      "uc_ref": "UC-30",
      "type": "security",
      "actor": "participant",
      "status": "[ ]",
      "path": "/api/admin/users",
      "steps": [
        "Авторизоваться как participant",
        "Отправить GET /api/admin/users",
        "Проверить HTTP 403"
      ],
      "expected": "403 Forbidden для non-admin ролей",
      "priority": "p1"
    },
    {
      "id": "sec-003",
      "title": "OTP brute force (6+ попыток) -> 429",
      "uc_ref": "UC-00",
      "type": "security",
      "actor": "guest",
      "status": "[ ]",
      "path": "/api/auth/request-code",
      "steps": [
        "Отправить 6 запросов POST /api/auth/request-code с одним email за 15 минут",
        "Проверить HTTP 429 на 6-м запросе"
      ],
      "expected": "429 Too Many Requests после превышения лимита (5 req / 15 мин)",
      "priority": "p1"
    },
    {
      "id": "sec-004",
      "title": "IDOR — участник читает чужую регистрацию",
      "uc_ref": "UC-32",
      "type": "security",
      "actor": "participant",
      "status": "[ ]",
      "path": "/api/tournaments/:id/registrations",
      "steps": [
        "Авторизоваться как participant (не комиссар)",
        "Отправить GET /api/tournaments/:id/registrations чужого турнира",
        "Проверить что доступ ограничен (403 или отсутствие данных)"
      ],
      "expected": "Участник не может читать регистрации чужого турнира напрямую",
      "priority": "p2"
    },
    {
      "id": "sec-005",
      "title": "Rate limit org form (4 submissions) -> 429",
      "uc_ref": "UC-15",
      "type": "security",
      "actor": "guest",
      "status": "[ ]",
      "path": "/api/organizations",
      "steps": [
        "Отправить 4 POST /api/organizations с одного IP за час",
        "Проверить HTTP 429 на 4-м запросе"
      ],
      "expected": "429 Too Many Requests после 3 заявок в час (rate limit)",
      "priority": "p2"
    },
    {
      "id": "sec-006",
      "title": "Загрузка .exe как аватар -> 422",
      "uc_ref": "SYS-05",
      "type": "security",
      "actor": "participant",
      "status": "[ ]",
      "path": "/api/profile/avatar",
      "steps": [
        "Авторизоваться как participant",
        "POST /api/profile/avatar с файлом .exe",
        "Проверить ошибку валидации (400/422)"
      ],
      "expected": "Файл отклонён — допустимы только JPG/PNG/WebP",
      "priority": "p2"
    },
    {
      "id": "sec-007",
      "title": "Оплата с чужим tournamentId -> 403",
      "uc_ref": "UC-10",
      "type": "security",
      "actor": "participant",
      "status": "[ ]",
      "path": "/api/payments/tournament/:tournamentId",
      "steps": [
        "Авторизоваться как participant без регистрации на турнир",
        "POST /api/payments/tournament/:tournamentId",
        "Проверить HTTP 400 'You are not registered for this tournament'"
      ],
      "expected": "Оплата отклонена для незарегистрированного участника",
      "priority": "p1"
    },
    {
      "id": "sec-008",
      "title": "returnUrl с внешним доменом -> редирект на /",
      "uc_ref": "UC-NEW-06",
      "type": "security",
      "actor": "guest",
      "status": "[ ]",
      "path": "/(auth)/login?returnUrl=https://evil.com",
      "steps": [
        "Открыть /(auth)/login?returnUrl=https://evil.com",
        "Пройти OTP аутентификацию",
        "Проверить что редирект идёт на / (не на evil.com)"
      ],
      "expected": "Внешний returnUrl игнорируется, редирект на главную. NOTE: в коде НЕ РЕАЛИЗОВАНА валидация returnUrl — может быть уязвимость",
      "priority": "p2"
    },
    {
      "id": "sec-009",
      "title": "Mass assignment (role: ADMIN в PATCH profile) -> игнорируется",
      "uc_ref": "UC-01",
      "type": "security",
      "actor": "participant",
      "status": "[ ]",
      "path": "/api/users/me",
      "steps": [
        "Авторизоваться как participant",
        "PUT /api/users/me с телом {name: 'Test', role: 'ADMIN'}",
        "Проверить что роль НЕ изменилась"
      ],
      "expected": "Поле role игнорируется в PUT /api/users/me",
      "priority": "p1"
    },
    {
      "id": "sec-010",
      "title": "SQL injection в search param -> 200",
      "uc_ref": "UC-27",
      "type": "security",
      "actor": "guest",
      "status": "[ ]",
      "path": "/api/tournaments?q='; DROP TABLE tournaments;--",
      "steps": [
        "GET /api/tournaments?q='; DROP TABLE tournaments;--",
        "Проверить HTTP 200 (не 500)",
        "Проверить что таблица не повреждена"
      ],
      "expected": "Prisma ORM параметризует запросы, injection невозможна, 200 OK",
      "priority": "p1"
    },
    {
      "id": "vis-001",
      "title": "Главная на mobile 430px",
      "uc_ref": "UC-25",
      "type": "visual",
      "actor": "guest",
      "status": "[ ]",
      "path": "/",
      "steps": [
        "Открыть / в viewport 430px",
        "Проверить отсутствие горизонтального overflow",
        "Проверить layout секций: hero, турниры, рейтинг, how it works",
        "Проверить читаемость текста и кнопок"
      ],
      "expected": "Все секции помещаются в 430px, нет overflow, кнопки кликабельны",
      "priority": "p2"
    },
    {
      "id": "vis-002",
      "title": "Каталог турниров на mobile",
      "uc_ref": "UC-27",
      "type": "visual",
      "actor": "guest",
      "status": "[ ]",
      "path": "/tournaments",
      "steps": [
        "Открыть /tournaments в viewport 430px",
        "Проверить карточки турниров — вмещаются в ширину",
        "Проверить фильтры — доступны и кликабельны",
        "Проверить пагинацию"
      ],
      "expected": "Карточки и фильтры корректно отображаются на mobile",
      "priority": "p2"
    },
    {
      "id": "vis-003",
      "title": "Dashboard на mobile",
      "uc_ref": "UC-04",
      "type": "visual",
      "actor": "participant",
      "status": "[ ]",
      "path": "/(dashboard)",
      "steps": [
        "Авторизоваться как участник",
        "Открыть /(dashboard) в viewport 430px",
        "Проверить все блоки: профиль, рейтинг, турниры — видны",
        "Проверить что блоки в колонку (не обрезаются)"
      ],
      "expected": "Dashboard блоки в колонку, все видны, нет обрезания",
      "priority": "p2"
    },
    {
      "id": "vis-004",
      "title": "Brand compliance: Navy/Gold, Playfair+Inter",
      "uc_ref": "UC-25",
      "type": "visual",
      "actor": "guest",
      "status": "[ ]",
      "path": "/",
      "steps": [
        "Открыть /",
        "Проверить цветовую схему: Navy основной, Gold акценты",
        "Проверить шрифты: Playfair Display для заголовков, Inter для текста",
        "Проверить логотип и иконки"
      ],
      "expected": "Цвета и шрифты соответствуют brand guide",
      "priority": "p3"
    },
    {
      "id": "vis-005",
      "title": "Auth flow на mobile 430px",
      "uc_ref": "UC-00",
      "type": "visual",
      "actor": "guest",
      "status": "[ ]",
      "path": "/(auth)/login",
      "steps": [
        "Открыть /(auth)/login в viewport 430px",
        "Проверить layout: иконка, заголовок, поле email, кнопка",
        "Перейти на OTP экран",
        "Проверить 6 ячеек кода: 48x56px, gap 8px",
        "Проверить KeyboardAvoidingView"
      ],
      "expected": "Auth экраны корректно отображаются на mobile, ячейки кода доступны",
      "priority": "p2"
    }
  ]
}
-->

<!-- COLLEGIUM_DECISIONS
{
  "UC-03": {"decision": "deleted", "reason": "replaced by UC-00 (OTP auth)", "date": "2026-04-03", "by": "user"},
  "UC-04-membership": {"decision": "deferred", "reason": "membership not planned in v1, hide from UI", "date": "2026-04-03", "by": "user"},
  "UC-06-stripe": {"decision": "cash-only-v1 → REVISED: implement Stripe", "reason": "Stripe account ready, implementing online payment", "date": "2026-04-03", "by": "user"},
  "UC-13": {"decision": "deferred", "reason": "commissioner map requires geocoding", "date": "2026-04-03", "by": "user"},
  "UC-15": {"decision": "keep-lead-form", "reason": "keep as lead form, org functionality deferred to v2", "date": "2026-04-03", "by": "user"},
  "UC-01-rewrite": {"decision": "approved", "reason": "rewrite to OTP flow", "date": "2026-04-03", "by": "collegium"},
  "UC-02-rewrite": {"decision": "approved", "reason": "remove UC-01 auth reference", "date": "2026-04-03", "by": "collegium"},
  "UC-08": {"decision": "deleted", "reason": "replaced by UC-23 (final standings only)", "date": "2026-04-03", "by": "user"},
  "UC-22-fide": {"decision": "text-only", "reason": "remove FIDE scraping, text field only for FIDE ID", "date": "2026-04-03", "by": "user"},
  "UC-10-stripe": {"decision": "implement", "reason": "Stripe account ready", "date": "2026-04-03", "by": "user"},
  "UC-23-fix": {"decision": "approved", "reason": "precondition changed to IN_PROGRESS, validation added for duplicate/missing places", "date": "2026-04-04", "by": "collegium"},
  "UC-20-watchlist": {"decision": "keep", "reason": "needed for pre-tournament email notifications (BizComplete)", "date": "2026-04-04", "by": "collegium"},
  "UC-19-quiz": {"decision": "cut", "reason": "no recommendation engine in v1, data unused, cut to backlog", "date": "2026-04-04", "by": "user"},
  "UC-26-history": {"decision": "keep — feature works in code, UI button exists on /ratings. Reverting cut.", "reason": "ratings/history fully implemented with pagination and View History button. Removing is a visible regression. UC-18 covers different use case (personal dashboard only).", "date": "2026-04-06", "by": "user"},
  "UC-NEW-01-cancellation": {"decision": "add-simplified", "reason": "status change automated, refunds manual via Stripe dashboard — no automated refund logic", "date": "2026-04-04", "by": "user"},
  "UC-NEW-02-webhook": {"decision": "add-as-SYS-04", "reason": "needed for Stripe payment confirmation flow", "date": "2026-04-04", "by": "collegium"},
  "UC-NEW-03-participant-cancel": {"decision": "no-cancel", "reason": "participant cannot cancel registration, no refund policy — CONFIRMED 2026-04-06", "date": "2026-04-06", "by": "user"},
  "UC-NEW-04-ban-consequences": {"decision": "skip", "reason": "out of scope for current phase", "date": "2026-04-04", "by": "user"},
  "UC-24-og-tags": {"decision": "add", "reason": "minimal effort with SSR, high organic growth ROI", "date": "2026-04-04", "by": "collegium"},
  "i18n": {"decision": "cut", "reason": "MVP: pick one language, add i18n framework later", "date": "2026-04-04", "by": "collegium"},
  "UC-NEW-08-multicommissioner": {"decision": "add", "reason": "multiple commissioners per tournament, lead+assistant roles", "date": "2026-04-04", "by": "user"},
  "UC-NEW-09-rounds": {"decision": "add (confirmed 2026-04-06)", "reason": "round-by-round match results with auto standings — confirmed by user", "date": "2026-04-06", "by": "user"},
  "UC-NEW-10-schedule": {"decision": "add", "reason": "detailed event schedule visible publicly", "date": "2026-04-04", "by": "user"},
  "UC-NEW-11-announcements": {"decision": "add (confirmed 2026-04-06, full with email+debounce)", "reason": "commissioner announcements feed with email notifications — confirmed by user", "date": "2026-04-06", "by": "user"},
  "UC-32-cancel": {"decision": "no-cancel", "reason": "cancel button removed from UC-32, confirmed 2026-04-06", "date": "2026-04-06", "by": "user"},
  "SYS-04-webhook": {"decision": "add-critical", "reason": "Stripe webhook handler missing from UC doc, critical for payment flow", "date": "2026-04-06", "by": "collegium"},
  "SYS-05-upload": {"decision": "add", "reason": "centralized file upload service needed for UC-09, UC-NEW-07, UC-05", "date": "2026-04-06", "by": "collegium"},
  "SYS-05-postmvp": {"decision": "defer-ac3-ac4-ac5", "reason": "image resize, signed URLs, cron cleanup deferred to post-MVP — files stored as-is with public URLs in MVP", "date": "2026-04-06", "by": "user"},
  "UC-CLEANUP-01": {"decision": "auto-fix", "reason": "orphan screens quiz+ratings/history to be removed/redirected", "date": "2026-04-06", "by": "collegium"},
  "SYS-06-chargeback": {"decision": "add", "reason": "charge.dispute.created must alert admin in system, not rely on Stripe Dashboard only", "date": "2026-04-06", "by": "user"},
  "SYS-04-event-type": {"decision": "use-checkout-session", "reason": "code uses checkout.session.completed, not payment_intent. UC must match code.", "date": "2026-04-06", "by": "collegium"},
  "free-tournament-confirm": {"decision": "add-UC-NEW-12", "reason": "free tournaments need auto-PAID status on registration approve", "date": "2026-04-06", "by": "collegium"},
  "ratings-history-cut": {"decision": "REVERTED — keep feature", "reason": "confirmed 2026-04-06", "date": "2026-04-06", "by": "user"}
,
  "UC-35-add": {"decision": "approved", "reason": "admin finances screen/endpoint had no UC — added UC-35", "date": "2026-04-06", "by": "collegium"},
  "UC-NEW-01-refund": {"decision": "manual-only", "reason": "refunds handled manually via Stripe Dashboard, no automated refund logic in MVP", "date": "2026-04-06", "by": "user"},
  "UC-NEW-12-fee-change": {"decision": "allow-grandfather", "reason": "fee change allowed after registrations; existing PAID registrations keep PAID status", "date": "2026-04-06", "by": "user"},
  "UC-38-email-optout": {"decision": "add-p2", "reason": "user approved: add User.emailOptOut + unsubscribe link in marketing emails", "date": "2026-04-06", "by": "user"},
  "UC-iCal-cut": {"decision": "backlog", "reason": "no code, no demand signal, MVP Guardian cut, user agreed", "date": "2026-04-06", "by": "user"},
  "SYS-07-ratelimit": {"decision": "add", "reason": "express-rate-limit for public endpoints", "date": "2026-04-06", "by": "collegium"},
  "UC-37-webhookviewer": {"decision": "add-p3", "reason": "admin UI for WebhookEvent debugging", "date": "2026-04-06", "by": "collegium"},
  "UC-39-commissionernotif": {"decision": "add-p2", "reason": "commissioner notified on new registrations", "date": "2026-04-06", "by": "collegium"}
}
-->

# USE CASES — Шахматная федерация (ChesTourism)

chesstourism.com / chesstourism.ru
НКО Международная Ассоциация Шахматного Туризма

## STATUS: PAGE_MAP
## PAGE_PROGRESS: 0/40 approved

---

## PAGES

### Public (GUEST — без авторизации)

- [ ] PAG-001: Landing
  Роли: PUBLIC
  Что видит: hero-секция (заголовок, CTA "Upcoming Tournaments"), ближайшие турниры (4 карточки, статус REGISTRATION_OPEN), топ-рейтинг (10 позиций), "How It Works" (4 шага), CTA-карточки "Become a Commissar" + "Host a Tournament", footer
  Действия: клик "Upcoming Tournaments" → /tournaments, клик турнира → /tournaments/[id], клик рейтинга → /ratings, клик "Become a Commissar" → /(auth)/login, клик "Host a Tournament" → /organizations/apply
  Состояния: default, loading (спиннеры секций), empty_tournaments (секция скрыта/заглушка)
  Элементы:
    - Button(primary): "Upcoming Tournaments" — CTA hero
    - Button(secondary): "Sign In" — nav
    - Card x4: турнир (title, startDate, city, country, status-badge, fee)
    - Card x2: CTA (Commissar / Host)
    - List x10: рейтинг (rank, name, country, elo)
    - Navigation: header (logo, links: Tournaments/Commissars/Rankings, btn Sign In)
    - Spinner: loading секций
    - Icon: chess, globe, calendar, trophy (How It Works)

- [ ] PAG-002: Tournament Catalog
  Роли: PUBLIC
  Что видит: список турниров (PUBLISHED+, без DRAFT), фильтры (страна, timeControl, статус, fee, дата), пагинация
  Действия: применить фильтры → обновить список, клик карточки → /tournaments/[id], Sign In → /(auth)/login
  Состояния: default, loading, empty (нет турниров), filtered_empty (фильтры дали 0 результатов)
  Элементы:
    - Input(select): "Country" — фильтр по стране
    - Input(select): "Time Control" — фильтр по типу контроля
    - Input(select): "Status" — фильтр по статусу
    - Input(select): "Fee" — Бесплатно / Платно
    - Button(secondary): "Reset Filters"
    - Card: турнир (title, startDate–endDate, city, country, status-badge, fee, commissioner name, registrationCount)
    - Badge(status): PUBLISHED / REGISTRATION_OPEN / ACTIVE / COMPLETED / CANCELLED
    - Pagination: prev/next + page numbers
    - Empty: иллюстрация + "No tournaments found"
    - Spinner: loading

- [ ] PAG-003: Tournament Detail
  Роли: PUBLIC (гость), CLIENT (зарегистрированный)
  Что видит: заголовок, даты, город, страна, формат, взнос, status-badge, OG-теги; табы: Info / Participants / Results / Photos; кнопка регистрации (если REGISTRATION_OPEN)
  Действия: выбрать таб, клик "Register" → POST /register (auth) → /dashboard/payment/[id] или подтверждение, клик "Watchlist" → добавить в watchlist, экспорт iCal
  Состояния: default, loading, error_404, tab_info, tab_participants (list/empty/loading), tab_results (list/empty), tab_photos (grid/empty), popup_registered (успешная бесплатная регистрация), already_registered (кнопка disabled), registration_closed (кнопка disabled + сообщение)
  Элементы:
    - Badge(status): турнир статус
    - Button(primary): "Register" — регистрация (CLIENT, REGISTRATION_OPEN)
    - Button(secondary): "Add to Watchlist" / "Remove from Watchlist"
    - Button(ghost): "Export to Calendar (.ics)"
    - Tabs: Info / Participants / Results / Photos
    - List(participants): участники (name, country, elo, registration status)
    - List(results): итоговые результаты (place, name, score)
    - Grid(photos): фотогалерея
    - Alert(info): "Registration closes in X days"
    - Alert(success): popup "Successfully registered!"
    - Spinner: loading tabs

- [ ] PAG-004: Commissar Catalog
  Роли: PUBLIC
  Что видит: карточки верифицированных комиссаров, фильтр по стране, поиск
  Действия: фильтр по стране, клик карточки → /commissars/[id]
  Состояния: default, loading, empty, filtered_empty, error
  Элементы:
    - Input(select): "Country" — фильтр
    - Input(text): "Search" — поиск по имени
    - Button(secondary): "Reset"
    - Card: комиссар (фото/аватар, имя, страна, город, кол-во турниров, badge "Verified")
    - Badge: "Verified"
    - Empty: "No commissars found"
    - Spinner: loading

- [ ] PAG-005: Commissar Public Profile
  Роли: PUBLIC
  Что видит: фото, имя, страна, город, bio, кол-во турниров, история проведённых турниров
  Действия: клик на турнир → /tournaments/[id]
  Состояния: default, loading, error_404
  Элементы:
    - Avatar: фото комиссара 96x96
    - Badge: "Verified Commissar"
    - List: проведённые турниры (title, date, city)
    - Spinner: loading
    - Alert(error): "Commissioner not found"

- [ ] PAG-006: Public User Profile
  Роли: PUBLIC
  Что видит: имя, фото, страна, ELO рейтинг, история турниров участника
  Действия: клик на турнир → /tournaments/[id]
  Состояния: default, loading, error_404
  Элементы:
    - Avatar: фото 80x80
    - Badge: ELO elo-рейтинг
    - List: история турниров (tournament, date, result, elo_change)
    - Icon: flag страны
    - Spinner: loading

- [ ] PAG-007: Rating List
  Роли: PUBLIC
  Что видит: топ рейтинг участников (ELO), пагинация, флаги стран
  Действия: клик игрока → /users/[id], пагинация
  Состояния: default, loading, empty, error
  Элементы:
    - List: рейтинг (rank, avatar, name, country-flag, elo, tournaments_count)
    - Pagination: страницы
    - Spinner: loading
    - Empty: "No ratings yet"

- [ ] PAG-008: ELO Rating History
  Роли: PUBLIC (смотреть), CLIENT (свой)
  Что видит: график изменения ELO по времени, список событий (турнир, elo_before, elo_after, delta)
  Действия: клик на событие → /tournaments/[id]
  Состояния: default, loading, empty (нет партий), error, needs_auth (для своей страницы)
  Элементы:
    - Chart: линейный график ELO по дате
    - List: события (tournament, date, elo_before → elo_after, Δ)
    - Badge(positive): "+12" (зелёный)
    - Badge(negative): "−5" (красный)
    - Alert(info): "Sign in to track your ELO history" (для гостя)
    - Spinner: loading

- [ ] PAG-009: Organization Apply
  Роли: PUBLIC
  Что видит: форма заявки от организации (отель, клуб) для партнёрства с ассоциацией
  Действия: заполнить и отправить → success
  Состояния: default, loading, success, validation_error, error_server
  Элементы:
    - Input(text): "Organization Name" — обязательное
    - Input(text): "Contact Name"
    - Input(email): "Contact Email"
    - Input(text): "City / Country"
    - Input(select): "Organization Type" — Hotel / Chess Club / Other
    - Input(textarea): "Message" — до 1000 символов
    - Button(primary): "Submit Application"
    - Alert(success): "Application submitted! We'll be in touch."
    - Alert(error): validation errors

- [ ] PAG-010: Certificate Verify
  Роли: PUBLIC
  Что видит: публичная страница верификации сертификата участника
  Действия: страница открывается по ссылке из сертификата
  Состояния: default (valid), loading, error_not_found, error_expired
  Элементы:
    - Card: данные сертификата (имя, турнир, место, дата)
    - Badge(success): "Verified Certificate"
    - Alert(error): "Certificate not found or expired"
    - Spinner: loading

- [ ] PAG-011: Payment Success
  Роли: PUBLIC (redirect после Stripe)
  Что видит: страница подтверждения успешной оплаты
  Действия: клик "Go to Dashboard" → /(dashboard)/
  Состояния: default
  Элементы:
    - Icon: checkmark (большой)
    - Button(primary): "Go to My Registrations" → /(dashboard)/my-registrations
    - Button(secondary): "View Tournament" → /tournaments/[id]

---

### Auth (PUBLIC)

- [ ] PAG-012: Email Login
  Роли: PUBLIC
  Что видит: поле email, кнопка "Get Code", ссылка на условия
  Действия: ввести email → POST /api/auth/request-otp → редирект на PAG-013
  Состояния: default, loading, validation_error (невалидный email), error_server, already_auth (редирект на dashboard)
  Элементы:
    - Input(email): "Your email" — обязательное
    - Button(primary): "Get Code"
    - Alert(error): validation / server error
    - Spinner: loading состояние кнопки
    - Link: "Back to home" → /

- [ ] PAG-013: OTP Verification
  Роли: PUBLIC
  Что видит: 6 полей для ввода кода, таймер для resend (60с), кнопка "Verify"
  Действия: ввести 6 цифр → POST /api/auth/verify-otp → dashboard или onboarding; resend → POST /api/auth/request-otp
  Состояния: default, loading, error_wrong_code, resend_available, resend_loading, success
  Элементы:
    - Input(otp): x6 цифр — автофокус следующее поле
    - Button(primary): "Verify Code"
    - Button(ghost): "Resend Code" — disabled пока таймер
    - Timer: "Resend in 00:45"
    - Alert(error): "Invalid code. Try again."
    - Spinner: loading

---

### Dashboard — Participant (CLIENT / COMMISSIONER)

- [ ] PAG-014: Dashboard Home
  Роли: CLIENT, COMMISSIONER
  Что видит: приветствие, ссылки на разделы (My Registrations, Watchlist, Profile, Notifications), быстрый доступ к следующему турниру
  Действия: переходы по разделам
  Состояния: empty (новый пользователь), with_data, loading
  Элементы:
    - Card: следующий зарегистрированный турнир (дата, название, статус)
    - Button(primary): "Browse Tournaments" (empty state)
    - List: быстрые ссылки (My Registrations, Watchlist, Profile)
    - Badge: кол-во непрочитанных уведомлений
    - Spinner: loading
    - Empty: "You haven't registered for any tournaments yet"

- [ ] PAG-015: Profile Settings
  Роли: CLIENT, COMMISSIONER
  Что видит: форма редактирования профиля (имя, фамилия, страна, город, FIDE ID, фото, дата рождения)
  Действия: изменить поля → сохранить → PUT /api/users/me; загрузить фото
  Состояния: default, loading, saving, success_toast, validation_error, error_server
  Элементы:
    - Avatar: фото 80x80 + кнопка "Change Photo"
    - Input(text): "First Name" — обязательное, maxLength 100
    - Input(text): "Last Name" — обязательное, maxLength 100
    - Input(select): "Country"
    - Input(text): "City"
    - Input(text): "FIDE ID" — опциональное, только цифры
    - Input(date): "Date of Birth"
    - Button(primary): "Save Changes"
    - Toast(success): "Profile updated"
    - Alert(error): validation errors

- [ ] PAG-016: My Registrations
  Роли: CLIENT
  Что видит: список своих регистраций на турниры с их статусами
  Действия: клик турнира → /tournaments/[id], кнопка "Withdraw" (если доступно)
  Состояния: default, loading, empty, error
  Элементы:
    - List: регистрации (tournament title, dates, city, fee, payment status badge)
    - Badge(status): PENDING / APPROVED / PAID / REJECTED / WITHDRAWN
    - Button(ghost): "Withdraw" — доступна до REGISTRATION_OPEN закрытия
    - Empty: "No registrations yet. Browse tournaments →"
    - Spinner: loading

- [ ] PAG-017: Watchlist
  Роли: CLIENT
  Что видит: список отслеживаемых турниров
  Действия: клик турнира → /tournaments/[id], удалить из watchlist
  Состояния: default, loading, empty, error
  Элементы:
    - List: турниры (title, startDate, city, status-badge)
    - Button(ghost): "Remove" — удалить из watchlist
    - Empty: "No tournaments in watchlist. Browse →"
    - Spinner: loading

- [ ] PAG-018: Notifications
  Роли: CLIENT, COMMISSIONER, ADMIN
  Что видит: список in-app уведомлений (новые регистрации, изменения статусов, объявления комиссара)
  Действия: клик уведомления → соответствующий экран, "Mark all as read"
  Состояния: default, loading, empty, error
  Элементы:
    - List: уведомления (иконка, текст, дата, read/unread indicator)
    - Button(secondary): "Mark all as read"
    - Badge: кол-во непрочитанных
    - Empty: "No notifications"
    - Spinner: loading

- [ ] PAG-019: Payment
  Роли: CLIENT
  Что видит: детали турнира, сумма взноса, кнопка "Pay with Card" (Stripe Checkout)
  Действия: клик "Pay" → Stripe Checkout → redirect /payment-success
  Состояния: default, loading, error_already_paid, error_tournament_not_found
  Элементы:
    - Card: турнир (title, dates, fee, currency)
    - Button(primary): "Pay €XX with Card" — открывает Stripe Checkout
    - Alert(info): "Your spot is reserved for 24 hours"
    - Alert(error): "Payment already completed" / tournament not found
    - Spinner: loading

---

### Commissioner (COMMISSIONER)

- [ ] PAG-020: Commissioner Cabinet
  Роли: COMMISSIONER
  Что видит: профиль комиссара (публичные данные), статус верификации, ссылки на управление турнирами
  Действия: перейти к редактированию профиля, перейти к турнирам
  Состояния: default, loading, unverified (ожидает модерации)
  Элементы:
    - Avatar: фото 80x80
    - Badge: "Verified" / "Pending Verification" / "Rejected"
    - Button(primary): "Edit Profile" → PAG-021
    - Button(secondary): "My Tournaments" → PAG-022
    - Alert(warning): "Your profile is under review" (Pending)
    - Alert(error): "Profile rejected. Please resubmit." (Rejected)
    - Spinner: loading

- [ ] PAG-021: Commissioner Profile Edit
  Роли: COMMISSIONER
  Что видит: форма редактирования комиссарского профиля (bio, специализация, опыт, фото)
  Действия: изменить поля → сохранить → PATCH /api/commissioner/profile
  Состояния: default, loading, saving, success_toast, validation_error
  Элементы:
    - Avatar: фото + "Change Photo"
    - Input(textarea): "Bio" — до 500 символов
    - Input(text): "Specialization" — категории шахмат
    - Input(number): "Years of Experience"
    - Input(select): "Country" / "City"
    - Button(primary): "Save"
    - Toast(success): "Profile updated"
    - Alert(error): validation errors

- [ ] PAG-022: My Tournaments List
  Роли: COMMISSIONER
  Что видит: список всех своих турниров (включая DRAFT)
  Действия: клик турнира → PAG-024, создать новый → PAG-023
  Состояния: default, loading, empty, error
  Элементы:
    - Button(primary): "Create Tournament" → PAG-023
    - List: турниры (title, status-badge, dates, city, registrationCount)
    - Badge(status): DRAFT / PUBLISHED / REGISTRATION_OPEN / ACTIVE / COMPLETED / CANCELLED
    - Empty: "No tournaments yet. Create one →"
    - Spinner: loading

- [ ] PAG-023: Create Tournament
  Роли: COMMISSIONER
  Что видит: многошаговая форма создания турнира (название, даты, город, страна, формат, взнос, лимиты)
  Действия: заполнить форму → POST /api/tournaments → создан DRAFT → редирект на PAG-024
  Состояния: default, loading, saving, validation_error, success
  Элементы:
    - Input(text): "Tournament Name" — обязательное, maxLength 200
    - Input(date): "Start Date" / "End Date"
    - Input(text): "City" / Input(select): "Country"
    - Input(select): "Time Control" — Classical / Rapid / Blitz
    - Input(number): "Entry Fee" (0 = бесплатно)
    - Input(select): "Currency" — EUR / USD / RUB
    - Input(number): "Max Participants"
    - Input(number): "Rating Limit" (0 = Open)
    - Input(textarea): "Description"
    - Button(primary): "Create Tournament"
    - Button(secondary): "Cancel"
    - Alert(error): validation errors

- [ ] PAG-024: Tournament Management Hub
  Роли: COMMISSIONER
  Что видит: навигационный хаб с разделами управления конкретным турниром
  Действия: переходы в подразделы (Edit, Registrations, Results, Photos, Rounds, Schedule, Announcements)
  Состояния: default, loading, error_404
  Элементы:
    - Card(header): название турнира, status-badge, даты
    - Button: "Edit" → PAG-025
    - Button: "Registrations" → PAG-026
    - Button: "Results" → PAG-027
    - Button: "Photos" → PAG-028
    - Button: "Rounds" → PAG-029
    - Button: "Schedule" → PAG-030
    - Button: "Announcements" → PAG-031
    - Badge(status): текущий статус турнира
    - Button(danger): "Cancel Tournament" → popup подтверждения

- [ ] PAG-025: Tournament Edit
  Роли: COMMISSIONER
  Что видит: форма редактирования турнира (те же поля что PAG-023 + управление статусом)
  Действия: изменить поля → PATCH /api/tournaments/[id]; сменить статус (Publish / Open Registration / etc.)
  Состояния: default, loading, saving, validation_error, success_toast, popup_status_change, popup_cancel
  Элементы:
    - (те же поля что PAG-023)
    - Button(primary): "Save Changes"
    - Button(secondary): "Publish" (DRAFT → PUBLISHED)
    - Button(secondary): "Open Registration" (PUBLISHED → REGISTRATION_OPEN)
    - Button(danger): "Cancel Tournament" — confirmation popup
    - Toast(success): "Tournament updated"

- [ ] PAG-026: Tournament Registrations
  Роли: COMMISSIONER
  Что видит: список зарегистрированных участников с их статусами оплаты; форма добавления вручную
  Действия: одобрить/отклонить регистрацию, отметить оплату наличными, добавить участника вручную
  Состояния: default, loading, empty, error, popup_add_participant, popup_mark_cash
  Элементы:
    - Button(primary): "Add Participant" — popup форма
    - List: участники (name, country, elo, registration_status, payment_status)
    - Button(secondary): "Approve" — PENDING → APPROVED
    - Button(ghost): "Reject"
    - Button(secondary): "Mark Cash Paid" — APPROVED → PAID (наличные)
    - Badge(status): PENDING / APPROVED / PAID / REJECTED
    - Modal: "Add Participant" (email, name)
    - Empty: "No registrations yet"
    - Spinner: loading

- [ ] PAG-027: Tournament Results
  Роли: COMMISSIONER
  Что видит: форма ввода итоговых результатов (место, имя/id участника, очки)
  Действия: ввести результаты → PUT /api/tournaments/[id]/results → автоматический расчёт ELO
  Состояния: default, loading, saving, success_toast, validation_error, results_locked (турнир COMPLETED)
  Элементы:
    - List: результаты (rank, participant select, score, elo_change preview)
    - Input(number): "Place" / "Score"
    - Button(primary): "Save Results"
    - Button(secondary): "Finalize & Calculate ELO" — блокирует редактирование
    - Alert(info): "ELO will be recalculated automatically"
    - Toast(success): "Results saved"

- [ ] PAG-028: Tournament Photos
  Роли: COMMISSIONER
  Что видит: галерея фотографий, форма загрузки
  Действия: загрузить фото → POST /api/tournaments/[id]/photos, удалить фото
  Состояния: default, loading, uploading, upload_success, upload_error, empty
  Элементы:
    - Input(file): "Upload Photos" — multiple, max 10MB each
    - Button(primary): "Upload"
    - Grid: фото с кнопкой удаления
    - Button(danger): "Delete" — на каждом фото
    - Progress: upload progress bar
    - Alert(error): upload error (size, format)
    - Empty: "No photos yet"

- [ ] PAG-029: Tournament Rounds
  Роли: COMMISSIONER
  Что видит: раунды турнира, пары (participant vs participant), результаты по партиям
  Действия: создать раунд, ввести результат партии, завершить раунд
  Состояния: default, loading, empty_rounds, popup_create_round, error
  Элементы:
    - Button(primary): "Create Next Round"
    - List(rounds): раунд (номер, дата, статус, пары)
    - List(pairs): пара (белые vs чёрные, результат 1-0 / 0-1 / ½-½)
    - Input(select): результат партии
    - Button(secondary): "Finalize Round"
    - Badge: статус раунда (PENDING / ONGOING / COMPLETED)
    - Empty: "No rounds created"

- [ ] PAG-030: Tournament Schedule
  Роли: COMMISSIONER (редактирование), PUBLIC (просмотр)
  Что видит: расписание мероприятий турнира (открытие, туры, закрытие)
  Действия: добавить событие, редактировать, удалить; просмотр публичной версии
  Состояния: default, loading, empty, editing, success_toast
  Элементы:
    - Button(primary): "Add Event" (COMMISSIONER)
    - List: события (date, time, title, description)
    - Input(date): "Date" / Input(time): "Time"
    - Input(text): "Event Name"
    - Input(textarea): "Description"
    - Button(ghost): "Edit" / Button(danger): "Delete"
    - Toast(success): "Schedule updated"
    - Empty: "No schedule yet"

- [ ] PAG-031: Tournament Announcements
  Роли: COMMISSIONER (создание), CLIENT/PUBLIC (просмотр)
  Что видит: лента объявлений от комиссара (важные сообщения участникам)
  Действия: создать объявление → POST /api/tournaments/[id]/announcements → in-app уведомления участникам
  Состояния: default, loading, empty, popup_create, success_toast, validation_error
  Элементы:
    - Button(primary): "New Announcement" — popup форма (COMMISSIONER)
    - List: объявления (дата, заголовок, текст, badge "New")
    - Modal: форма (Input(text): title, Input(textarea): body — maxLength 1000, Button(primary): "Publish")
    - Badge: "New" — непрочитанное
    - Empty: "No announcements yet"
    - Toast(success): "Announcement published"

---

### Admin (ADMIN)

- [ ] PAG-032: Admin Dashboard
  Роли: ADMIN
  Что видит: сводные метрики (users, tournaments, revenue, open disputes), быстрые ссылки на разделы
  Действия: переходы в подразделы
  Состояния: default, loading, error
  Элементы:
    - Card x4: метрики (Total Users, Active Tournaments, Revenue, Open Disputes)
    - Button: "Users" / "Tournaments" / "Moderation" / "Finances" / "Disputes" / "Webhooks"
    - Spinner: loading метрик

- [ ] PAG-033: Admin Users
  Роли: ADMIN
  Что видит: список всех пользователей с ролями и статусами
  Действия: поиск, фильтр по роли, изменить роль пользователя
  Состояния: default, loading, empty, error
  Элементы:
    - Input(text): "Search" — по имени/email
    - Input(select): "Role" — ALL / CLIENT / COMMISSIONER / ADMIN
    - List: пользователи (avatar, name, email, role, createdAt)
    - Button(secondary): "Change Role" → popup
    - Modal: "Change Role" (select)
    - Pagination
    - Spinner: loading

- [ ] PAG-034: Admin Tournaments
  Роли: ADMIN
  Что видит: список всех турниров (включая DRAFT), возможность смены статуса, удаления
  Действия: поиск, фильтр по статусу, изменить статус, удалить
  Состояния: default, loading, empty, error, popup_delete
  Элементы:
    - Input(text): "Search"
    - Input(select): "Status"
    - List: турниры (title, commissioner, status-badge, dates, participants count)
    - Button(ghost): "Change Status"
    - Button(danger): "Delete" + confirmation popup
    - Pagination
    - Spinner: loading

- [ ] PAG-035: Admin Organizations
  Роли: ADMIN
  Что видит: список заявок от организаций
  Действия: просмотр деталей, одобрить / отклонить
  Состояния: default, loading, empty, error
  Элементы:
    - List: заявки (название, тип, контакт, статус-badge, дата)
    - Badge(status): PENDING / APPROVED / REJECTED
    - Button(secondary): "Approve"
    - Button(danger): "Reject"
    - Spinner: loading
    - Empty: "No applications"

- [ ] PAG-036: Admin Moderation
  Роли: ADMIN
  Что видит: заявки комиссаров на верификацию
  Действия: просмотр профиля комиссара, одобрить / отклонить
  Состояния: default, loading, empty, error
  Элементы:
    - List: заявки (имя, страна, опыт, bio, дата подачи, статус)
    - Badge(status): PENDING / VERIFIED / REJECTED
    - Button(primary): "Verify"
    - Button(danger): "Reject"
    - Spinner: loading
    - Empty: "No pending applications"

- [ ] PAG-037: Admin Finances
  Роли: ADMIN
  Что видит: 4 summary-карточки (Total Revenue, Paid Count, Pending, Refunds+Disputes), список транзакций с фильтром периода
  Действия: фильтр периода (All / This Month / Last 30d / This Year), пагинация "Load More"
  Состояния: default, loading, empty, error
  Элементы:
    - Card x4: Total Revenue / Paid Count / Pending / Refunds+Disputes
    - Input(select): период фильтрации
    - List: транзакции (user, tournament, amount, currency, status-badge, date)
    - Badge(status): PAID / PENDING / FAILED / DISPUTED / REFUNDED
    - Button(secondary): "Load More"
    - Spinner: loading

- [ ] PAG-038: Admin Disputes
  Роли: ADMIN
  Что видит: список чарджбэков и диспутов от Stripe, статусы
  Действия: просмотр деталей диспута, отметить как обработанный
  Состояния: default, loading, empty, error
  Элементы:
    - List: диспуты (stripe_id, user, tournament, amount, status, date)
    - Badge(status): OPEN / WON / LOST / NEEDS_RESPONSE
    - Button(secondary): "Mark Resolved"
    - Alert(warning): "Respond to disputes within 7 days"
    - Spinner: loading
    - Empty: "No disputes"

- [ ] PAG-039: Admin Webhooks
  Роли: ADMIN
  Что видит: лог Stripe webhook событий для отладки
  Действия: просмотр, фильтр по типу события, клик → PAG-040
  Состояния: default, loading, empty, error
  Элементы:
    - Input(select): "Event Type" — фильтр
    - List: события (type, status, createdAt, payload preview)
    - Badge(status): PROCESSED / FAILED / SKIPPED
    - Pagination
    - Spinner: loading
    - Empty: "No webhook events"

- [ ] PAG-040: Admin Webhook Detail
  Роли: ADMIN
  Что видит: детали одного webhook события (полный payload, ответ, ошибки)
  Действия: просмотр, кнопка "Retry" если FAILED
  Состояния: default, loading, error_404
  Элементы:
    - Card: event type, status-badge, createdAt, processedAt
    - Code block: JSON payload
    - Code block: response / error
    - Button(secondary): "Retry" (FAILED только)
    - Alert(error): "Processing failed: [message]"
    - Spinner: loading

---

## USER STORIES (LEGACY — see PAGES)

---

## Product Vision & Roles

**What:** A platform for discovering, registering, and managing chess tournaments worldwide, serving both competitive players and tournament organizers under the umbrella of an international non-profit association.

**Value proposition:**
- Guest: Browse upcoming tournaments, view results and player ratings without an account
- Participant: Register for tournaments, track ELO history, manage travel logistics, pay entry fees online
- Commissioner: Run tournaments end-to-end — pairings, results, arbitration — without paper or spreadsheets
- Admin: Oversee association membership, accreditation, finances, and platform health from one place

**Market:** Competitive chess players (club-level to FIDE-rated), national and regional tournament organizers, chess clubs and federations seeking digital infrastructure

---

### Guest — casual visitor or prospective participant
- **Goal:** Find a tournament to attend or follow results of an ongoing event
- **Pain:** Chess tournament info is scattered across federation websites, PDF bulletins, and Facebook groups
- **Tech level:** low / medium
- **Frustrations:** Can't find registration deadlines, venue details are missing, results published days late, no mobile-friendly interface

### Participant — registered chess player
- **Goal:** Discover relevant tournaments by location/rating/format, register and pay, track their own ELO progression
- **Pain:** Registration is often done by email or paper; payment is bank transfer; no single place to see their own tournament history
- **Tech level:** medium
- **Frustrations:** Unclear registration status, no confirmation email, ELO not updated for weeks

### Commissioner — accredited judge or tournament organizer (lead or assistant)
- **Goal:** Run a tournament with correct pairings, real-time result entry, and final report generation
- **Pain:** Swiss pairing software is desktop-only, results entered into Excel, reports assembled manually
- **Tech level:** medium
- **Frustrations:** Two commissioners editing simultaneously causes conflicts; assistant permissions undefined; post-tournament report takes hours

### Admin — association staff member
- **Goal:** Approve commissioner accreditations, resolve disputes, monitor payments, export data
- **Pain:** No audit trail for manual overrides, financial reconciliation requires cross-referencing Stripe and internal records
- **Tech level:** high
- **Frustrations:** Can't see why a payment failed without digging into Stripe dashboard, no alerting when cron jobs silently fail

### System — automated processes
- **Goal:** Reliable transactional email, ELO recalculation, Stripe webhook processing, MinIO orphan cleanup
- **Pain:** Race conditions on concurrent submissions, webhooks arriving out of order, email provider rate limits
- **Tech level:** N/A

---

## UC-00: Аутентификация по OTP (Email → Code → JWT)

**Актор:** Гость / незарегистрированный пользователь
**Цель:** Войти в систему или создать аккаунт

**Предусловие:** Пользователь открыл сайт, не авторизован

**Основной поток:**
1. Пользователь нажимает "Войти" или "Стать участником"
2. Экран: ввод email
   - Поле: Email*
   - Кнопка "Получить код"
3. Система отправляет на email 6-значный OTP код (dev-режим: всегда 000000)
4. Экран: ввод кода
   - Поле: 6-значный код*
   - Кнопка "Войти"
   - Ссылка "Отправить код повторно" (доступна через 60 сек)
5. Система проверяет код через POST /api/auth/verify-code
6. Если пользователь не существует → создаётся автоматически (email, роль PARTICIPANT)
7. Система выдаёт: access token (15 мин) + refresh token (30 дней)
8. Если onboardingCompleted=false → редирект на /profile для заполнения профиля (UC-01). (UC-19 quiz: deferred)
9. Если onboarding пройден → редирект в личный кабинет (UC-04)

**Альтернативные потоки:**
- A1: Неверный код → "Неверный код. Осталось N попыток"
- A2: Код истёк (15 мин) → "Код устарел. Запросить новый?"
- A3: Rate limit превышен (5 запросов/15 мин на email) → HTTP 429 "Слишком много запросов. Попробуйте позже"
- A4: Email недоступен → показать ошибку сети

**Токены:**
- access_token: JWT, 15 мин, передаётся в Authorization header или httpOnly cookie
- refresh_token: JWT, 30 дней, sliding window rotation (POST /api/auth/refresh)
- Веб: httpOnly cookies; Native: тело ответа → SecureStore

**Acceptance criteria:**
- AC1: Один и тот же flow для входа И регистрации (пользователь создаётся при первом входе)
- AC2: OTP действителен 15 минут, одноразовый
- AC3: Повторная отправка не чаще раза в 60 секунд
- AC4: Максимум 5 OTP-запросов на email за 15 минут
- AC5: access token 15 мин, refresh 30 дней с rotation
- AC6: Dev-режим: OTP всегда 000000

**UI состояния (из кода):**
- **Loading:** Кнопка "Get Code" показывает спиннер (loading=true), disabled во время запроса. Кнопка "Verify" аналогично. Resend code показывает "Sending..."
- **Empty:** Экран email: иконка шахматного короля, заголовок "Sign In", подзаголовок "Enter your email to receive a one-time code", пустое поле email, кнопка "Get Code"
- **Error:** Красный текст ошибки по центру над полем: "Please enter your email" / "Please enter a valid email address" / "Failed to send code. Please try again." / "Invalid code. Please try again." / "Too many OTP requests. Try again later." (HTTP 429) / "Please enter all 6 digits"
- **Success:** OTP экран: "Check Your Email" + "We sent a 6-digit code to {email}". При успешном resend: зеленый текст "Code resent!" (исчезает через 5 сек). После верификации: redirect на returnUrl или /

**Валидация (из кода):**
- Email (client): regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`, обязательное поле
- Email (server): `email.trim().toLowerCase()`, обязательное поле, HTTP 400 "email is required"
- OTP код (client): 6 цифр, только цифры (value.replace(/\D/g, '')), фокус автоматически переходит на следующую ячейку
- OTP код (server): `code.trim()`, обязательное поле, HTTP 400 "email and code are required"
- Rate limit (server): in-memory Map, 5 req / 15 мин на email, HTTP 429
- Rate limit (express-rate-limit): 10 req / 15 мин на /api/auth/*

**Уведомления:**
- Email OTP: отправляется через Brevo API, от noreply@diagrams.love (FROM_NAME: "ChesTourism"), тема: "Your ChesTourism login code", HTML с кодом крупным шрифтом (32px, letter-spacing 8px), текст "This code expires in 10 minutes"
- Fallback: при ошибке Brevo API — исключение, клиент получает "Failed to send code"

**Edge cases:**
- Двойной клик "Get Code": кнопка disabled через loading state, предотвращает дублирование
- Потеря соединения при отправке OTP: catch → "Failed to send code. Please try again."
- Backspace на пустой ячейке: фокус переходит на предыдущую ячейку
- Неверный код: поля очищаются, фокус на первую ячейку
- Resend cooldown: 60 сек таймер, кнопка "Resend in Ns" disabled
- returnUrl с внешним доменом: не валидируется на клиенте (передается как есть). На данный момент returnUrl подставляется в router.replace напрямую

**Responsive:**
- Mobile (430px): ScrollView + KeyboardAvoidingView, padding 24px, ячейки кода 48x56px, gap 8px
- Desktop: тот же layout, центрирован по вертикали (justifyContent: center)

**Гость видит:**
- Обе страницы (login, otp) полностью доступны без авторизации
- CTA: "Sign In" → ввод email → "Get Code"

---

## UC-01: Профиль участника — первичное заполнение

**Актор:** Новый участник (после первого входа через UC-00)
**Цель:** Заполнить профиль участника

**Предусловие:** Пользователь авторизован через OTP (UC-00), onboardingCompleted=true

**Основной поток:**
1. Участник переходит в раздел "Мой профиль"
2. Экран: форма редактирования профиля
   - Редактируемые поля: Имя*, Фамилия, Страна* (dropdown ISO), Дата рождения, FIDE ID (опционально)
   - Email отображается как read-only
3. Участник заполняет/обновляет данные и нажимает "Сохранить"
4. Данные сохраняются через PUT /api/users/me

**Альтернативные потоки:**
- A1: FIDE ID введён → сохраняется как текстовое поле (UC-22, text-only — автоматический lookup не реализован в v1)
- A2: Пустые обязательные поля → ошибка валидации

**Acceptance criteria:**
- AC1: Email нельзя изменить (read-only)
- AC2: Страна выбирается из ISO списка
- AC3: Данные сохраняются немедленно

**UI состояния:**
- **Loading:** Кнопка "Сохранить" показывает спиннер
- **Empty:** Форма с предзаполненными данными (name, surname из User модели), email disabled
- **Error:** Пустые обязательные поля: "Имя обязательно", "Страна обязательна"
- **Success:** Данные обновлены, тост/сообщение "Профиль сохранён"

**Валидация (из кода — PUT /api/users/me):**
- name: string, обязательное (trim)
- surname: string, опционально
- country: string, обязательное
- fideId: string, опционально, max 20 символов (text field, без API проверки)
- phone: string, опционально
- city: string, опционально
- email: read-only, не принимается в запросе

**Данные в Prisma (User model):**
- name: String?, surname: String?, phone: String?, city: String?, country: String?, fideId: String?, fideRating: Int?, fideTitle: String?, rating: Int @default(1200), onboardingCompleted: Boolean @default(false)

**Edge cases:**
- Параллельное сохранение: последний запрос побеждает (no optimistic locking)
- Потеря соединения: ошибка сети → "Internal server error"

**Responsive:**
- Mobile (430px): ScrollView с полями в колонку, padding
- Desktop: тот же layout, максимальная ширина контента

---

## UC-02: Регистрация комиссара

**Актор:** Гость или Участник
**Цель:** Получить статус аккредитованного комиссара

> Note (AdminMirror): Обновить AC6 — вместо ссылки на карту (UC-13, deferred) указать список комиссаров /commissars.

> Note (SecOfficer 2026-04-06): Commissioner photo upload (avatar_url) MUST go through SYS-05 validation middleware (MIME type check, 5MB limit). Do NOT accept raw file upload without validation.

**Предусловие:** Пользователь открыл сайт (может быть уже участником)

**Основной поток:**
1. Пользователь нажимает "Стать комиссаром"
2. Экран: форма заявки на комиссара
   - Если не зарегистрирован: проходит UC-00 сначала
   - Если уже участник: только дополнительные поля
   - Дополнительные поля: Опыт работы с шахматами* (textarea, min 50 символов), Регион работы* (страна + город), Локации работы* (до 3 городов, autocomplete), Фото (аватар, опционально), Биография (textarea, опционально)
   - Кнопка "Подать заявку"
3. Система создаёт заявку со статусом "commissioner_pending"
4. Администратор получает уведомление о новой заявке комиссара
5. Администратор проверяет заявку в панели (UC-16)
6. Администратор одобряет → email "Вы аккредитованы как комиссар"
7. Роль обновляется на "commissioner"
8. Комиссар входит → видит расширенную панель с возможностью создания турниров

**Альтернативные потоки:**
- A1: Участник уже является комиссаром → "Вы уже аккредитованный комиссар"
- A2: Опыт < 50 символов → ошибка "Опишите ваш опыт подробнее (минимум 50 символов)"
- A3: Указано > 3 локаций → ошибка "Максимум 3 города"
- A4: Администратор отклоняет → email с причиной, статус = "commissioner_rejected"
- A5: Фото > 5MB → ошибка "Максимальный размер фото 5MB"
- A6: Фото не в формате JPG/PNG → ошибка "Допустимые форматы: JPG, PNG"

**Данные (дополнительные к участнику):**
- experience: text, required, min 50 chars
- work_region: string, required
- locations: array of {city: string, country: string}, max 3, required
- avatar_url: string, optional
- bio: text, optional
- commissioner_status: enum [commissioner_pending, commissioner_approved, commissioner_rejected]

**Acceptance criteria:**
- AC1: Заявка комиссара создаётся со статусом "commissioner_pending"
- AC2: Если пользователь новый — проходит OTP flow (UC-00) сначала
- AC3: Если уже участник — не дублируются базовые данные
- AC4: После одобрения роль = "commissioner"
- AC5: Комиссар видит доп. функции: создание турниров, управление взносами
- AC6: Локации (до 3) отображаются в каталоге комиссаров (UC-29)
- AC7: Администратор получает email о новой заявке

**UI состояния:**
- **Loading:** Кнопка "Подать заявку" со спиннером
- **Empty:** Если пользователь не авторизован → сначала проходит UC-00. Если уже участник → форма с доп. полями (bio, experience, locations)
- **Error:** "Опишите ваш опыт подробнее (минимум 50 символов)" / "Максимум 3 города" / "Максимальный размер фото 5MB" / "Допустимые форматы: JPG, PNG" / "Вы уже аккредитованный комиссар"
- **Success:** "Заявка отправлена. Ожидайте рассмотрения"

**Валидация (из кода):**
- experience: text, required, min 50 chars
- work_region: string, required
- locations: array max 3
- avatar: через SYS-05 — MIME: image/jpeg, image/png, image/webp; max 5MB
- bio: text, optional

**Вложения/Медиа:**
- Аватар комиссара: загрузка через POST /api/profile/avatar
- Форматы: JPG/PNG/WebP (валидация в storage.service.ts — UPLOAD_CONFIGS.avatar)
- Лимит: 5MB (UPLOAD_CONFIGS.avatar.maxBytes)
- Хранение: S3/MinIO, bucket "chesstourism", prefix "avatars/{uuid}.{ext}"
- URL: публичный (STORAGE_ENDPOINT/STORAGE_BUCKET/key)

**Уведомления:**
- Email администратору: о новой заявке комиссара (trigger: создание заявки)
- Email комиссару при одобрении: sendCommissarApproval() — тема "Your commissar application has been approved!", от ChesTourism <noreply@diagrams.love>
- Email комиссару при отклонении: sendCommissarApproval(approved=false) — тема "Update on your commissar application", с комментарием причины

**Edge cases:**
- Участник уже комиссар → ошибка "Вы уже аккредитованный комиссар"
- Commissioner model в Prisma: userId unique — один Commissioner на User

**Данные (Prisma Commissioner model):**
- id: cuid, userId: String @unique, bio: String?, specialization: String?, country: String?, city: String?, photoUrl: String?, isVerified: Boolean @default(false)

---

## UC-03: Вход в систему / восстановление пароля

> **Status: DEPRECATED** — Replaced by UC-00 (OTP Authentication). This UC described email+password login and password recovery which do not exist in the implemented system. Kept for historical reference only.

**Актор:** Зарегистрированный пользователь
**Цель:** Войти в личный кабинет или восстановить утерянный пароль

**Предусловие:** Пользователь зарегистрирован (email подтверждён)

### Поток A: Вход в систему
1. Пользователь нажимает "Войти"
2. Экран: форма входа
   - Поля: Email*, Пароль*
   - Ссылка "Забыли пароль?"
   - Кнопка "Войти"
3. Система проверяет credentials
4. Успех → редирект в личный кабинет (соответствующий роли)
5. Устанавливается JWT-токен (httpOnly cookie, срок: 30 дней)

### Поток B: Восстановление пароля
1. Пользователь нажимает "Забыли пароль?"
2. Экран: форма восстановления
   - Поле: Email*
   - Кнопка "Отправить ссылку для сброса"
3. Система отправляет email со ссылкой сброса пароля
4. Экран: "Ссылка отправлена на {email}"
5. Пользователь кликает ссылку
6. Экран: форма нового пароля
   - Поля: Новый пароль*, Подтверждение пароля*
   - Кнопка "Сохранить"
7. Пароль обновлён → "Пароль изменён. Войдите с новым паролем"
8. Редирект на форму входа

**Альтернативные потоки:**
- A1: Неверный email/пароль → "Неверный email или пароль" (3 попытки, затем 15 мин блокировка)
- A2: Email не подтверждён → "Подтвердите email. Отправить ссылку повторно?"
- A3: Аккаунт rejected → "Ваша заявка отклонена. Обратитесь в поддержку"
- A4: Ссылка сброса просрочена (2ч) → "Ссылка недействительна. Запросить новую?"
- A5: Пароли не совпадают → ошибка валидации
- A6: Аккаунт pending_approval → вход разрешён, но функционал ограничен (только просмотр статуса заявки)

**Данные:**
- login_attempts: integer, per IP+email, reset after success
- reset_token: string, unique, expires in 2 hours
- jwt_token: httpOnly cookie, 30 days TTL

**Acceptance criteria:**
- AC1: Вход работает для всех ролей (participant, commissioner, admin)
- AC2: После 3 неудачных попыток — блокировка 15 минут
- AC3: Ссылка сброса действительна 2 часа, одноразовая
- AC4: JWT-токен httpOnly, Secure, SameSite=Strict
- AC5: После сброса пароля все предыдущие сессии инвалидируются
- AC6: Пользователь с pending_approval может войти, но видит только статус заявки

---

## UC-04: Личный кабинет участника

**Актор:** Участник (active)
**Цель:** Просмотреть и управлять своим профилем, рейтингом, турнирами

> Note (AdminMirror): Убрать из основного потока ссылки на статус членства и кнопку сертификата — deferred в v1.

**Предусловие:** Пользователь авторизован, статус = "active", роль = "participant"

**Основной поток:**
1. Участник входит в систему
2. Экран: Личный кабинет — Dashboard
   - Блок "Профиль": ФИО, страна, дата рождения, FIDE ID, статус членства
   - Блок "Рейтинг": текущий рейтинг (число), позиция в общем рейтинге (#N из M)
   - Блок "Турниры": количество турниров, последний турнир (дата, место, результат)
   - Блок "Членство": статус, дата вступления, кнопка "Скачать сертификат" (UC-05)

> Note (2026-04-03): Membership feature deferred to v2. Hide "Download Certificate" button and membership block from UI. Only participation certificate (UC-05b) is available.

3. Участник может редактировать профиль
   - Экран: форма редактирования
   - Редактируемые поля: ФИО, Страна, Дата рождения, FIDE ID
   - Нередактируемые: Email (показывается, но disabled)
   - Кнопка "Сохранить"
4. Участник может перейти к разделам:
   - "Мои турниры" → UC-18
   - "Мой сертификат" → UC-05
   - "Рейтинг" → UC-17

**Альтернативные потоки:**
- A1: Статус = "pending_approval" → кабинет показывает только "Ваша заявка на рассмотрении"
- A2: Статус = "rejected" → "Ваша заявка отклонена. Причина: {reason}"
- A3: FIDE ID изменён → статус FIDE не перепроверяется (v1 — без интеграции FIDE API)

**Данные отображения:**
- current_rating: integer, calculated
- rating_position: integer (rank among all active participants)
- tournaments_count: integer
- last_tournament: {name, date, place, result, rating_change}
- membership_date: date (date of approval)

**Acceptance criteria:**
- AC1: Dashboard загружается < 2 секунд
- AC2: Рейтинг и позиция актуальны (обновляются после завершения турниров)
- AC3: Редактирование профиля сохраняется мгновенно
- AC4: Email нельзя изменить из кабинета
- AC5: Кабинет адаптивен (desktop + mobile)

**UI состояния:**
- **Loading:** Спиннер при загрузке данных dashboard
- **Empty:** Нет турниров → "Вы ещё не участвовали в турнирах", рейтинг = 1200, position = 1 из N
- **Error:** Ошибка загрузки → generic error message
- **Success:** Все блоки отображены с актуальными данными

**Данные в карточке:**
- Профиль: ФИО (name + surname), страна (country), город (city), FIDE ID (fideId), фото (photoUrl)
- Рейтинг: effectiveRating (fideRating если есть, иначе rating), rank (позиция среди всех PARTICIPANT), total (всего участников)
- Турниры: количество (tournamentRegistrations count where status in APPROVED/PAID)
- Членство: deferred to v2 — скрыто в UI

**Responsive:**
- Mobile (430px): блоки в колонку, полная ширина
- Desktop: блоки в сетку

---

## UC-05: Скачать сертификат членства

> **v1 SCOPE:** Only participation certificate per tournament is implemented (tournament name, place, date, participant name). Membership certificate is deferred to v2. Certificate is generated after tournament status = COMPLETED.

> Note (2026-04-03): Only **participation certificate** (per tournament, after COMPLETED status) is implemented. Membership certificate is deferred to v2.

> Note (BizComplete): Переименовать в "Сертификат участия" — только per-tournament, не членский. Требует отдельного UC-05b для участнического сертификата.

> Note (BizComplete): UC body describes membership certificate. In v1 only participation certificate per tournament is implemented (tournament name, place, date, participant name). Rewrite body before implementation to reflect participation certificate only.

**Актор:** Участник (active)
**Цель:** Получить PDF-сертификат членства в Ассоциации

**Предусловие:** Участник авторизован, статус = "active"

**Основной поток:**
1. Участник в личном кабинете нажимает "Скачать сертификат"
2. Система генерирует PDF-сертификат:
   - Логотип Ассоциации
   - Заголовок: "Сертификат членства"
   - ФИО участника
   - Дата вступления (дата одобрения заявки)
   - Уникальный номер сертификата (формат: IACT-YYYY-NNNNN)
   - QR-код для верификации (ссылка: chesstourism.com/verify/{certificate_id})
   - Подпись председателя (изображение)
3. Браузер скачивает PDF файл
4. Файл именуется: "IACT_Certificate_{full_name}_{date}.pdf"

**Альтернативные потоки:**
- A1: Статус не "active" → кнопка "Скачать" скрыта, показан текст "Сертификат доступен после одобрения заявки"
- A2: Ошибка генерации PDF → "Не удалось сгенерировать сертификат. Попробуйте позже"
- A3: Гость переходит по QR-ссылке → публичная страница верификации: "Сертификат #{number} действителен. Участник: {name}, дата: {date}"

**Данные:**
- certificate_id: string, unique, format: IACT-YYYY-NNNNN
- generated_at: datetime
- verify_url: string, format: chesstourism.com/verify/{certificate_id}
- pdf_template: predefined layout with logo, signature image

**Acceptance criteria:**
- AC1: PDF генерируется динамически при каждом запросе (актуальные данные)
- AC2: QR-код ведёт на рабочую страницу верификации
- AC3: Сертификат содержит уникальный номер
- AC4: PDF корректно отображается в любом PDF-ридере
- AC5: Размер PDF < 500KB
- AC6: Сертификат бесплатный (v1)

**UI состояния:**
- **Loading:** Спиннер генерации PDF
- **Empty:** Турнир не COMPLETED → кнопка скрыта / сообщение "Certificate is only available for completed tournaments"
- **Error:** "You do not have an approved registration for this tournament" (HTTP 403) / "Tournament not found" (HTTP 404) / "Не удалось сгенерировать сертификат. Попробуйте позже"
- **Success:** Браузер скачивает PDF файл (Content-Disposition: attachment)

**Endpoint (реализовано):** GET /api/tournaments/:id/my-certificate
- Требует: authenticate
- Проверяет: tournament.status === 'COMPLETED', registration.status in ['APPROVED', 'PAID']
- Генерирует: generateParticipationCertificate({participantName, tournamentName, tournamentDate, place, commissionerName})
- Response: application/pdf, filename "certificate_{safe_title}.pdf"

**Данные сертификата (из pdf.service.ts):**
- Имя участника (user.name || user.email)
- Название турнира
- Дата турнира (startDate, format: "day month year" en-GB)
- Место (если есть результат в TournamentResult)
- Имя комиссара

**Верификация (из кода):**
- GET /api/verify/:id — публичная страница, экран /verify/[id].tsx
- Проверяет валидность сертификата по ID

**Edge cases:**
- Участник без результата (TournamentResult) — place = undefined, сертификат без места
- Participation cert vs Membership cert — разные endpoints: /api/tournaments/:id/my-certificate vs /api/profile/membership-certificate

---

## UC-06: Создание турнира (комиссар)

> Note (2026-04-03): Online payments via Stripe are not yet integrated (SYS-01 in backlog). Currently only cash payments work — commissioner confirms via PATCH /api/tournaments/:id/participants/:userId/confirm-cash.

**Актор:** Комиссар
**Цель:** Создать новый шахматный турнир

**Предусловие:** Комиссар авторизован, роль = "commissioner"

**Основной поток:**
1. Комиссар нажимает "Новый турнир" в панели управления
2. Экран: форма создания турнира
   - Поля:
     - Название турнира* (string, max 100)
     - Место проведения* (dropdown из своих локаций + ручной ввод)
     - Адрес* (string)
     - Дата начала* (datepicker, >= сегодня)
     - Дата окончания* (datepicker, >= дата начала)
     - Формат* (dropdown: классика, рапид, блиц, другое)
     - Описание (textarea, опционально)
     - Взнос за участие (number, опционально, в USD)
     - Максимальное количество участников (number, опционально)
   - Кнопка "Создать турнир"
3. Система создаёт турнир со статусом "draft"
4. Экран: страница турнира с вкладками:
   - "Информация" (редактирование)
   - "Участники" (пустой список)
   - "Результаты" (заблокировано до добавления участников)
   - "Фото" (заблокировано до завершения)
5. Комиссар нажимает "Опубликовать" → статус меняется на "published"
6. Турнир появляется на публичной странице и на карте

**Альтернативные потоки:**
- A1: Дата окончания < дата начала → ошибка "Дата окончания не может быть раньше начала"
- A2: Название пустое или > 100 символов → ошибка валидации
- A3: Комиссар сохраняет как draft → турнир не публичный, можно вернуться позже
- A4: Комиссар удаляет draft → подтверждение "Удалить черновик?" → удаление
- A5: Турнир с взносом = 0 → участие бесплатное, оплата не требуется

**Данные:**
- tournament_id: uuid, auto
- name: string, required, max 100
- location: string, required
- address: string, required
- start_date: date, required
- end_date: date, required, >= start_date
- format: enum [classic, rapid, blitz, other], required
- description: text, optional
- entry_fee: decimal, optional, default: 0
- max_participants: integer, optional, nullable
- status: enum [draft, published, in_progress, completed, cancelled], default: draft
- commissioner_id: FK to users, required
- created_at: datetime

**Acceptance criteria:**
- AC1: Только комиссар может создать турнир
- AC2: Турнир в статусе "draft" не виден публично
- AC3: После публикации турнир виден на сайте и карте
- AC4: Место проведения предлагает автодополнение из локаций комиссара
- AC5: Дата начала >= сегодня
- AC6: Взнос = 0 по умолчанию (бесплатный турнир)

**UI состояния:**
- **Loading:** Кнопка "Создать турнир" со спиннером
- **Empty:** Форма с пустыми полями, статус по умолчанию DRAFT
- **Error:** "title, startDate, and endDate are required" (400) / "Invalid date format" (400) / "endDate must be after startDate" (400) / "Complete your commissioner profile first" (400) / "Commissioner account not verified yet" (403)
- **Success:** Турнир создан (201), перенаправление на страницу турнира

**Валидация (из кода — POST /api/tournaments):**
- title: required, trim
- startDate: required, Date parsing, isNaN check
- endDate: required, Date parsing, must be after startDate
- city: optional, trim
- country: optional, trim
- maxParticipants: optional, parseInt
- fee: optional, parseFloat, default null (не 0!)
- currency: optional, default "USD"
- description: optional, trim || null
- ratingLimit: optional, parseInt
- timeControl: optional, trim, toLowerCase

**Роли/Доступ (из middleware):**
- requireRole('COMMISSIONER', 'ADMIN')
- Commissioner должен быть isVerified=true (или role=ADMIN)
- Commissioner record должен существовать

**State Machine (VALID_TRANSITIONS из кода):**
- DRAFT → [PUBLISHED, CANCELLED]
- PUBLISHED → [REGISTRATION_OPEN, CANCELLED]
- REGISTRATION_OPEN → [REGISTRATION_CLOSED, CANCELLED]
- REGISTRATION_CLOSED → [IN_PROGRESS, CANCELLED]
- IN_PROGRESS → [COMPLETED, CANCELLED]
- COMPLETED → []
- CANCELLED → []

**Данные (Prisma Tournament model):**
- id: cuid, title: String, city: String, country: String, startDate: DateTime, endDate: DateTime
- status: TournamentStatus @default(DRAFT), commissionerId: String (FK Commissioner)
- maxParticipants: Int?, fee: Float?, currency: String @default("USD")
- description: String?, ratingLimit: Int?, timeControl: String?
- Indexes: [commissionerId], [status]

**Edge cases:**
- Комиссар без Commissioner record → "Complete your commissioner profile first"
- Комиссар не верифицирован → 403
- Delete: нельзя удалить IN_PROGRESS или COMPLETED турниры

---

## UC-07: Добавление участников в турнир

> Note (SecOfficer): Rate limit на invitation emails — максимум 50 приглашений в час на турнир.

> Note (UX Advocate): Self-registered participants (UC-28) appear in this list automatically. UC-07 is for manual commissioner add only. Participant status is based on payment method: cash → PENDING_PAYMENT, online → auto-confirmed after Stripe payment.

**Актор:** Комиссар
**Цель:** Сформировать список участников турнира

**Предусловие:** Турнир создан (draft или published), комиссар — владелец турнира

**Основной поток:**
1. Комиссар открывает турнир → вкладка "Участники"
2. Экран: список участников (изначально пустой)
   - Поиск: строка поиска по имени / email / FIDE ID
   - Кнопка "Добавить участника"
3. Комиссар вводит имя/email в поиск → система показывает совпадения из базы
4. Комиссар выбирает участника → участник добавляется в список турнира
5. Экран обновляется: таблица участников
   - Колонки: #, ФИО, Страна, Рейтинг, Статус оплаты, Действия
   - Действия: "Удалить из турнира"
6. Если у турнира есть взнос → статус оплаты: "Не оплачен" / "Оплачен наличными"
7. Участнику отправляется email-приглашение на турнир

**Альтернативные потоки:**
- A1: Участник не найден в базе → "Участник не найден. Пригласить по email?" → ввод email → система отправляет приглашение на регистрацию
- A2: Участник уже добавлен → "Участник уже в списке"
- A3: Достигнут max_participants → "Максимальное количество участников достигнуто"
- A4: Комиссар удаляет участника из турнира → подтверждение → удаление, участник получает email "Вы исключены из турнира {name}"
- A5: Турнир бесплатный → колонка "Статус оплаты" скрыта

**Данные:**
- tournament_participant: {tournament_id, user_id, payment_status, added_at}
- payment_status: enum [not_paid, paid_cash, not_required]

**Acceptance criteria:**
- AC1: Поиск участников работает по имени, email, FIDE ID
- AC2: Нельзя добавить одного участника дважды
- AC3: Max_participants соблюдается (если задан)
- AC4: Email-приглашение отправляется при добавлении
- AC5: Комиссар может удалить участника до начала турнира
- AC6: Бесплатные турниры не показывают колонку оплаты

**UI состояния:**
- **Loading:** Спиннер загрузки списка регистраций
- **Empty:** "Нет зарегистрированных участников"
- **Error:** "Not authorized" (403) / "Tournament not found" (404)
- **Success:** Таблица с участниками, статусы оплаты

**Данные в таблице регистраций (из GET /api/tournaments/:id/registrations):**
- user: id, name, email, rating, city, phone
- status: PENDING / APPROVED / REJECTED / PAID
- createdAt: дата регистрации

**Действия комиссара (из PUT /api/tournaments/:id/registrations/:regId):**
- Approve: status → APPROVED (платный) / PAID (бесплатный, UC-NEW-12)
- Reject: status → REJECTED

**Уведомления при одобрении/отклонении (из кода):**
- APPROVED → createNotification(userId, 'REGISTRATION_APPROVED', 'Заявка одобрена', 'Ваша заявка на турнир "{title}" одобрена. Вы приняты!')
- REJECTED → createNotification(userId, 'REGISTRATION_REJECTED', 'Заявка отклонена', 'Ваша заявка на турнир "{title}" была отклонена.')

---

## [~] UC-08: Ввод результатов партий (per-game) — DEFERRED

> Status: deferred to backlog — заменён UC-23 (итоговые места). Per-game ввод может быть добавлен post-MVP.

**Актор:** Комиссар
**Цель:** Зафиксировать результаты партий и обновить рейтинги участников

**Предусловие:** Турнир опубликован, участники добавлены (>= 2), турнир в статусе "published" или "in_progress"

**Основной поток:**
1. Комиссар открывает турнир → вкладка "Результаты"
2. Комиссар нажимает "Начать турнир" → статус = "in_progress"
3. Экран: таблица для ввода результатов
   - Формат: матрица "Участник vs Участник" или список партий
   - Для каждой партии: Белые (dropdown), Чёрные (dropdown), Результат (1-0, 0-1, 1/2-1/2)
   - Кнопка "Добавить партию"
4. Комиссар добавляет результаты партий одну за одной
5. Таблица обновляется: для каждого участника показываются очки
6. После внесения всех результатов комиссар нажимает "Завершить турнир"
7. Экран подтверждения: сводная таблица, 1/2/3 место
8. Комиссар нажимает "Подтвердить результаты"
9. Статус = "completed"
10. Система автоматически пересчитывает рейтинги (ELO):
    - Начальный рейтинг: 1200
    - K-фактор: 32 (для рейтинга < 2400), 16 (для >= 2400)
    - Формула: R_new = R_old + K × (S - E), где E = 1 / (1 + 10^((R_opponent - R_old) / 400))
11. Рейтинги обновлены → каждому участнику виден rating_change
12. Система определяет 1, 2, 3 место по очкам
13. Запуск UC-12: автоматическая рассылка грамот

**Альтернативные потоки:**
- A1: Менее 2 участников → "Добавьте минимум 2 участников для начала"
- A2: Партия с одинаковыми игроками → ошибка "Игрок не может играть сам с собой"
- A3: Дублирование партии (те же 2 игрока, тот же тур) → предупреждение "Партия уже зарегистрирована. Заменить?"
- A4: Комиссар хочет отменить турнир → "Отменить турнир?" → статус = "cancelled", рейтинги не пересчитываются
- A5: Ничья в очках за 1/2/3 место → дополнительные критерии: Бухгольц, затем Бергер, затем по решению комиссара
- A6: Комиссар редактирует результат после ввода (до завершения) → обновляет партию
- A7: После завершения турнира результаты нельзя изменить (только через администратора)

**Данные:**
- game: {tournament_id, white_player_id, black_player_id, result, round, created_at}
- result: enum [white_wins (1-0), black_wins (0-1), draw (1/2-1/2)]
- tournament_standing: {tournament_id, user_id, points, place, rating_before, rating_after}
- rating_change: integer (rating_after - rating_before)

**Acceptance criteria:**
- AC1: Результаты вносятся попартийно
- AC2: Рейтинг пересчитывается автоматически по ELO при завершении
- AC3: 1/2/3 место определяются по сумме очков
- AC4: После завершения — автоматическая рассылка грамот (UC-12)
- AC5: Нельзя играть самому с собой
- AC6: После "completed" результаты locked (only admin can edit)
- AC7: Rating_change виден каждому участнику в истории турнира

---

## UC-09: Загрузка фото с турнира

**Актор:** Комиссар
**Цель:** Опубликовать фотоматериалы с турнира

**Предусловие:** Турнир завершён (status = "completed"), комиссар — владелец турнира

**Основной поток:**
1. Комиссар открывает завершённый турнир → вкладка "Фото"
2. Экран: галерея (пустая или с ранее загруженными)
   - Кнопка "Добавить фото"
   - Drag & drop зона
   - Счётчик: "{N} из 10 фото загружено"
3. Комиссар выбирает файлы (до 10 вертикальных фото)
4. Preview загружаемых фото перед подтверждением
5. Комиссар нажимает "Загрузить"
6. Прогресс-бар для каждого фото
7. Фото появляются на публичной странице турнира в галерее

**Альтернативные потоки:**
- A1: Попытка загрузить > 10 фото → "Максимум 10 фото на турнир"
- A2: Файл не изображение → "Допустимые форматы: JPG, PNG, WebP"
- A3: Файл > 10MB → "Максимальный размер фото 10MB"
- A4: Комиссар удаляет фото → подтверждение → удаление
- A5: Турнир не завершён → вкладка "Фото" заблокирована с пояснением "Фото можно загрузить после завершения турнира"
- A6: Горизонтальное фото → принимается, но рекомендация "Для лучшего отображения используйте вертикальные фото"

**Данные:**
- tournament_photo: {tournament_id, url, order, uploaded_at}
- max_photos_per_tournament: 10
- allowed_formats: [jpg, png, webp]
- max_file_size: 10MB
- storage: S3-compatible (MinIO)

**Acceptance criteria:**
- AC1: Максимум 10 фото на турнир
- AC2: Поддерживаемые форматы: JPG, PNG, WebP
- AC3: Фото оптимизируются при загрузке (resize до max 1920px по большей стороне)
- AC4: Фото отображаются на публичной странице турнира
- AC5: Комиссар может удалить загруженное фото
- AC6: Drag & drop работает корректно

**Вложения/Медиа (из storage.service.ts):**
- Категория: 'tournament-photo'
- Форматы: image/jpeg, image/png, image/webp
- Лимит: 10MB (UPLOAD_CONFIGS['tournament-photo'].maxBytes)
- Хранение: S3/MinIO, prefix "tournaments/photos/{uuid}.{ext}"
- URL: публичный (STORAGE_ENDPOINT/STORAGE_BUCKET/key)
- Resize: НЕ РЕАЛИЗОВАНО в MVP (deferred)

**API Endpoints (из кода):**
- GET /api/tournaments/:id/photos — публичный, список фото (id, url, caption, createdAt, uploader.name)
- POST /api/tournaments/:id/photos — Commissioner/Admin, body: {url, caption}. Валидация: url required, http/https only
- DELETE /api/tournaments/:id/photos/:photoId — Commissioner/Admin, возвращает 204

**UI состояния:**
- **Loading:** Прогресс-бар для каждого фото (описано в UC, upload progress)
- **Empty:** Галерея пуста, кнопка "Добавить фото"
- **Error:** "Invalid url format" / "url must use http or https" / "Not authorized" / "Tournament not found"
- **Success:** Фото добавлено в галерею

**Данные (Prisma TournamentPhoto):**
- id: cuid, tournamentId: String, url: String, caption: String?, uploadedBy: String (FK User), createdAt: DateTime

**Edge cases:**
- Нет ограничения на количество фото в коде (UC описывает max 10, но API не проверяет!)

---

## UC-10: Оплата взноса онлайн

> Note (BizComplete): Stripe интеграция активирована, UC-10 возвращён из deferred. Stripe ключи сохранены в Doppler (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY). Task #1978/#1709.

> Note (Architect): payment_provider enum = [stripe] only. YuKassa deferred. Remove from implementation schema.

> Note (SecOfficer 2026-04-06): Idempotency обязательна. Stripe может отправить один webhook несколько раз. Использовать payment_intent_id как idempotency key: хранить в таблице webhook_events {stripe_event_id, processed_at}. Если event_id уже обработан — ответить 200, не обновлять статус повторно.

**Актор:** Участник
**Цель:** Оплатить взнос за участие в турнире

**Предусловие:** Участник авторизован, добавлен в турнир с ненулевым взносом, статус оплаты = "not_paid"

**Основной поток:**
1. Участник видит турнир в "Мои турниры" или получает email-приглашение
2. Экран: страница турнира
   - Информация о турнире
   - Статус: "Взнос не оплачен — ${amount}"
   - Кнопка "Оплатить онлайн"
3. Участник нажимает "Оплатить онлайн"
4. Редирект на страницу платёжной системы (Stripe / ЮKassa)
5. Участник вводит данные карты, подтверждает оплату
6. Success → редирект обратно на сайт
7. Экран: "Оплата прошла успешно! Взнос за турнир {name} оплачен"
8. Статус оплаты = "paid_online"
9. Комиссар видит обновлённый статус в списке участников

**Альтернативные потоки:**
- A1: Оплата отклонена → "Оплата не прошла. Попробуйте другую карту или обратитесь в банк"
- A2: Пользователь отменил оплату → возврат на сайт, статус = "not_paid"
- A3: Таймаут платёжной системы → "Произошла ошибка. Если деньги списаны, обратитесь в поддержку"
- A4: Повторная оплата уже оплаченного → кнопка "Оплатить" скрыта, показан "Оплачено"
- A5: Webhook от платёжной системы не дошёл → запрос статуса по cron через 5 минут

**Данные:**
- payment: {user_id, tournament_id, amount, currency, payment_provider, payment_id, status, created_at}
- payment_status: enum [pending, completed, failed, refunded]
- payment_provider: enum [stripe, yukassa]

**Acceptance criteria:**
- AC1: Оплата проходит через Stripe или ЮKassa (определяется при интеграции)
- AC2: Статус обновляется через webhook (не polling на клиенте)
- AC3: При успешной оплате — статус участника в турнире = "paid_online"
- AC4: Нельзя оплатить дважды
- AC5: Fallback: проверка статуса по cron через 5 мин если webhook не дошёл
- AC6: Сумма в валюте турнира (USD по умолчанию)

**UI состояния:**
- **Loading:** Редирект на Stripe Checkout (новая страница / вкладка)
- **Empty:** Кнопка "Оплатить онлайн" на странице турнира, рядом сумма ${fee} {currency}
- **Error:** "You are not registered for this tournament" (400) / "Registration is already paid" (400) / "Registration must be approved before payment" (400) / "This tournament is free — no payment required" (400) / Stripe decline → "Оплата не прошла"
- **Success:** Redirect на /payment-success?tournamentId={id}

**Endpoint (реализовано — POST /api/payments/tournament/:tournamentId):**
- Требует: authenticate, registration.status === 'APPROVED'
- Reuse: если есть PENDING payment с externalId → проверяет session.status === 'open' → возвращает существующий checkoutUrl
- Создает Stripe Checkout Session: mode='payment', customer_email, metadata: {tournamentId, userId, registrationId}
- line_items: currency из tournament, unit_amount = Math.round(fee * 100) (центы)
- success_url: {APP_URL}/payment-success?tournamentId={id}
- cancel_url: {APP_URL}/tournaments/{id}

**Данные (Prisma Payment):**
- id: cuid, userId: String, tournamentId: String?, amount: Float, currency: String @default("USD")
- status: PaymentStatus (PENDING/PAID/FAILED/REFUNDED/DISPUTED), externalId: String? (Stripe session ID)
- Связь: registration → payment через paymentId (unique)

**Idempotency (реализовано):**
- WebhookEvent table: stripeEventId @unique, processedAt, eventType, status, errorMessage, rawRef
- При повторном webhook: findUnique по stripeEventId → если найден, skip + return 200

**Edge cases:**
- Пользователь закрывает Stripe Checkout → cancel_url → статус остаётся PENDING
- Двойной клик: reuse logic — если есть open session, возвращает тот же checkoutUrl
- Webhook не дошёл: cron fallback описан в UC, но НЕ РЕАЛИЗОВАН в коде

---

## UC-11: Отметка оплаты наличными (комиссар)

**Актор:** Комиссар
**Цель:** Зафиксировать оплату взноса наличными

**Предусловие:** Комиссар авторизован, турнир с ненулевым взносом, участник в списке

**Основной поток:**
1. Комиссар открывает турнир → вкладка "Участники"
2. Экран: таблица участников с колонкой "Статус оплаты"
3. Напротив участника со статусом "Не оплачен" — кнопка "Отметить наличные"
4. Комиссар нажимает кнопку
5. Модальное окно подтверждения: "Подтвердить получение наличных от {ФИО} — ${amount}?"
6. Комиссар подтверждает
7. Статус оплаты = "paid_cash"
8. Таблица обновляется: "Оплачено (наличные)" с меткой времени

**Альтернативные потоки:**
- A1: Участник уже оплатил онлайн → кнопка "Отметить наличные" скрыта
- A2: Комиссар ошибочно отметил → кнопка "Отменить" в течение 10 минут
- A3: Турнир бесплатный → столбец оплаты отсутствует

**Данные:**
- payment_status обновляется на "paid_cash"
- cash_marked_at: datetime
- cash_marked_by: FK to users (commissioner)

**Acceptance criteria:**
- AC1: Только комиссар-владелец турнира может отметить оплату наличными
- AC2: Подтверждение через модальное окно (без случайных кликов)
- AC3: Отмена возможна в течение 10 минут
- AC4: Нельзя отметить наличные если уже оплачено онлайн
- AC5: Метка времени фиксируется

**Endpoint (реализовано — PATCH /api/tournaments/:id/participants/:userId/confirm-cash):**
- Требует: authenticate, requireRole('COMMISSIONER', 'ADMIN')
- Проверки: tournament exists, commissioner is owner or admin, isVerified, status in ['REGISTRATION_OPEN', 'IN_PROGRESS']
- Логика: если payment уже есть и PAID → 400 "Payment is already confirmed"; если payment есть но не PAID → update to PAID; если payment нет → create new Payment(amount=fee, status=PAID) + link to registration

**Уведомления (из кода):**
- In-app: createNotification(participantUserId, 'PAYMENT_CONFIRMED', 'Оплата подтверждена', 'Комиссар подтвердил вашу оплату наличными для турнира "{title}"')
- Fire-and-forget (.catch(() => {}))

**UI состояния:**
- **Loading:** Кнопка "Отметить наличные" со спиннером
- **Error:** "Payment is already confirmed" (400) / "Participant not registered" (404) / "Tournament must be in REGISTRATION_OPEN or IN_PROGRESS status" (400)
- **Success:** Статус обновляется в таблице, badge "Оплачено (наличные)"

---

## UC-12: Автоматическая рассылка грамот победителям

> Note (Architect): Очередь email с retry требует job processor (Bull/BullMQ). Описано в SYS-03.

> Note (Architect): UC-08 was deleted. Trigger: Commissioner clicks "Approve Results" in UC-23 → diploma generation starts. Link this UC to UC-23 instead of UC-08.

**Актор:** Система (триггер: комиссар завершает турнир через UC-23)
**Цель:** Отправить грамоты победителям и благодарственные письма участникам

**Предусловие:** Турнир завершён (status = "completed"), места 1/2/3 определены

**Основной поток:**
1. Комиссар нажимает "Подвести итоги" в завершённом турнире
2. Экран: сводная таблица с местами
   - 1 место: {ФИО}, {очки}
   - 2 место: {ФИО}, {очки}
   - 3 место: {ФИО}, {очки}
   - Кнопка "Утвердить и разослать грамоты"
3. Комиссар нажимает "Утвердить"
4. Система генерирует PDF-грамоты для 1, 2, 3 места:
   - Логотип Ассоциации
   - "Грамота за {1/2/3} место"
   - Название турнира, дата, место
   - ФИО победителя
   - Подпись комиссара + печать Ассоциации
5. Система отправляет email победителям с PDF-грамотой во вложении
6. Система отправляет благодарственные письма всем остальным участникам:
   - "Спасибо за участие в турнире {name}!"
   - Результат участника, изменение рейтинга
7. Экран: "Грамоты отправлены (3), благодарственные письма отправлены ({N})"

**Альтернативные потоки:**
- A1: Менее 3 участников → грамоты только для имеющихся мест
- A2: У участника нет email → пропускается с пометкой "Email не отправлен"
- A3: Ошибка отправки email → retry 3 раза с интервалом 5 мин
- A4: Комиссар хочет пересмотреть итоги → "Отменить рассылку" (доступно если письма ещё не отправлены)

**Данные:**
- diploma_pdf: generated per winner
- diploma_template: includes logo, tournament info, player name, place
- email_queue: {recipient, type (diploma/thanks), tournament_id, status, attempts}

**Acceptance criteria:**
- AC1: PDF-грамоты генерируются для 1/2/3 места
- AC2: Благодарственные письма — всем участникам (не призёрам)
- AC3: PDF корректный, содержит название турнира и имя
- AC4: Retry при ошибке отправки (3 попытки)
- AC5: Комиссар видит статус рассылки
- AC6: Не отправляется повторно (idempotent)

**Уведомления (из email.service.ts):**
- Грамоты (1/2/3 место): sendResultsWithCertificate(to, userName, tournamentName, place, eloChange, certificatePdf) — тема: "Congratulations! {place} Place in {tournamentName}", PDF в attachment (base64)
- Результаты остальным: sendTournamentResults(to, userName, tournamentName, place, eloChange) — тема: "Tournament Results: {tournamentName}", place text + ELO change
- Благодарственные: sendThankYouEmail(to, userName, tournamentName) — тема: "Thank you for participating in {tournamentName}!"

**Вложения/Медиа:**
- PDF грамоты: генерируется через pdf.service.ts (generateParticipationCertificate)
- Attachment: Brevo API, {name: "certificate-{tournament}-{place}.pdf", content: base64}

**Edge cases:**
- Email provider (Brevo) rate limit: при ошибке — throw, retry описан в UC но queue (BullMQ) инициализирован только для schedule debounce

---

## UC-13: Карта комиссаров

> Status: deferred — Commissioner map requires geocoding (lat/lng not in schema). Commissioner directory with country filter (UC-10, /commissars) available as alternative.

**Актор:** Гость / Участник / любой посетитель
**Цель:** Найти комиссаров по географическому расположению

**Предусловие:** Открыта страница "Карта"

**Основной поток:**
1. Пользователь переходит на вкладку "Карта"
2. Экран: интерактивная карта мира (Mapbox/Leaflet)
   - Маркеры на городах, где работают комиссары
   - Кластеризация маркеров при zoom out
   - Панель фильтров: Страна (dropdown), Город (текстовый поиск)
3. Пользователь кликает на маркер города
4. Popup/sidebar: список комиссаров в этом городе
   - Для каждого: фото, имя, количество турниров
   - Кнопка "Профиль" → UC-14
5. Пользователь может подать заявку прямо с карты → "Подать заявку" → UC-15

**Альтернативные потоки:**
- A1: В городе нет комиссаров → маркер отсутствует
- A2: Фильтр по стране → карта зумится на страну, показывает только её маркеры
- A3: Мобильная версия → полноэкранная карта, фильтры в drawer снизу
- A4: Нет геолокации у локации комиссара → геокодинг при сохранении локации

**Данные:**
- commissioner_locations: [{user_id, city, country, lat, lng}]
- geocoding: при сохранении локации (API: OpenStreetMap Nominatim — бесплатный)

**Acceptance criteria:**
- AC1: Карта загружается < 3 секунд
- AC2: Маркеры корректно отображают города комиссаров
- AC3: Кластеризация работает при большом количестве маркеров
- AC4: Фильтрация по стране/городу работает
- AC5: Клик на маркер показывает комиссаров
- AC6: Карта адаптивна (desktop + mobile)
- AC7: Геокодинг происходит на бэкенде при сохранении локации

---

## UC-14: Публичная страница комиссара

> Note (Architect): Убрать mini-map из AC4 в v1 (UC-13 deferred). Заменить на текстовый список городов.

> Note (Architect): mini-map deferred (UC-13). AC4 implementation = text list of cities (up to 3) instead of map.

**Актор:** Гость / Участник / любой посетитель
**Цель:** Просмотреть информацию о комиссаре

**Предусловие:** Комиссар аккредитован (status = "commissioner_approved")

**Основной поток:**
1. Пользователь переходит на страницу комиссара (из карты, из списка, по прямой ссылке)
2. Экран: публичный профиль комиссара
   - Фото (аватар)
   - ФИО
   - Биография
   - Города работы (до 3, с маркерами на мини-карте)
   - Статистика:
     - Проведённых турниров: {N}
     - Общее количество участников: {N}
     - Средний размер турнира: {N}
   - Достижения (текстовый список, заполняет комиссар)
   - Последние турниры (список, ссылки)
3. Кнопки:
   - "Подать заявку на участие" → UC-00
   - "Предложить провести турнир" → UC-15

**Альтернативные потоки:**
- A1: Комиссар без турниров → статистика = "Пока нет турниров"
- A2: Комиссар без фото → дефолтный аватар
- A3: Комиссар без биографии → секция скрыта
- A4: Прямая ссылка на несуществующего комиссара → 404

**Данные отображения:**
- tournaments_count: integer (count of completed tournaments)
- total_participants: integer (sum across all tournaments)
- avg_tournament_size: float
- achievements: text (free-form, entered by commissioner)
- recent_tournaments: [{name, date, participants_count}], last 5

**Acceptance criteria:**
- AC1: Страница доступна без авторизации (публичная)
- AC2: URL формат: chesstourism.com/commissioner/{slug или id}
- AC3: Статистика актуальна (обновляется при завершении турниров)
- AC4: Мини-карта показывает локации комиссара
- AC5: SEO: meta-теги для каждого комиссара

---

## UC-15: Заявка от организации (отель/клуб)

**Актор:** Представитель организации (гость)
**Цель:** Предложить площадку для проведения турнира

**Предусловие:** Открыта форма заявки (доступна из карты, из меню, со страницы комиссара)

> Note (2026-04-03): Keep as lead form only. Org functionality (commissioner assignment, status tracking) deferred to v2. Form submits and sends notification to admin. No org account or dashboard in v1.

**Основной поток:**
1. Представитель нажимает "Провести турнир у нас"
2. Экран: форма заявки организации
   - Поля:
     - Название организации* (string)
     - Тип* (dropdown: отель, клуб, школа, другое)
     - Адрес* (string + geocoding для карты)
     - Город* (string)
     - Страна* (dropdown)
     - Контактное лицо* (ФИО)
     - Email контактного лица*
     - Телефон (опционально)
     - Описание площадки* (textarea, min 30 символов): вместимость, условия, оборудование
   - Кнопка "Отправить заявку"
3. Система создаёт заявку со статусом "new"
4. Экран: "Спасибо! Ваша заявка принята. Мы свяжемся с вами в течение 5 рабочих дней"
5. Администратор получает email-уведомление о новой заявке
6. Администратор рассматривает заявку (UC-16) и назначает ближайшего комиссара
7. Организация получает email: "Вам назначен комиссар {ФИО}, email: {email}, тел: {phone}"

**Альтернативные потоки:**
- A1: Обязательные поля не заполнены → ошибка валидации
- A2: Некорректный email → "Проверьте email"
- A3: Описание < 30 символов → "Опишите площадку подробнее"
- A4: Организация из региона, где нет комиссаров → заявка принимается, администратор решает вручную
- A5: Дублирование заявки (та же организация, тот же email) → предупреждение "Заявка от этой организации уже существует"

**Данные:**
- organization_request: {id, name, type, address, city, country, contact_name, contact_email, contact_phone, description, status, assigned_commissioner_id, created_at}
- status: enum [new, reviewing, approved, rejected, assigned]
- type: enum [hotel, club, school, other]

**Acceptance criteria:**
- AC1: Форма доступна без авторизации
- AC2: После отправки — email администратору
- AC3: Заявка появляется в админ-панели
- AC4: После назначения комиссара — email организации
- AC5: Дубликаты предотвращаются (по email организации)
- AC6: Rate limit: max 3 lead form submissions per IP per hour. Bot protection (hCaptcha or Cloudflare Turnstile) recommended.

**Данные (Prisma OrganizationRequest):**
- id: cuid, organizationName: String, contactName: String, email: String, phone: String?, description: String?, status: RequestStatus @default(PENDING), createdAt: DateTime
- Нет: address, city, country, type (в UC описаны, в schema отсутствуют)

**Уведомления:**
- Email admin: о новой заявке организации (trigger: создание)
- Email организации при решении: sendOrganizationRequestDecision(to, contactName, organizationName, approved, reason?) — тема: "Your organization {name} has been approved/declined"

**UI состояния:**
- **Loading:** Кнопка "Отправить заявку" со спиннером
- **Empty:** Форма с пустыми полями
- **Error:** Валидация обязательных полей
- **Success:** "Спасибо! Ваша заявка принята"

**Гость видит:** Форма полностью доступна без авторизации

---

## UC-16: Модерация заявок (администратор)

> Note (SecOfficer): Массовое одобрение (A2) должно показывать confirmation modal.

**Актор:** Администратор
**Цель:** Рассмотреть и обработать входящие заявки

**Предусловие:** Администратор авторизован, роль = "admin"

**Основной поток:**
1. Администратор заходит в панель управления
2. Экран: Dashboard администратора
   - Счётчики: Новые заявки участников ({N}), Новые заявки комиссаров ({N}), Заявки организаций ({N})
   - Кнопки перехода к каждому разделу
3. Администратор открывает раздел "Заявки участников"
4. Экран: таблица заявок
   - Колонки: Дата, ФИО, Email, Страна, FIDE ID, Статус
   - Фильтры: по статусу (pending/approved/rejected), по дате
   - Сортировка: по дате (новые первые)
5. Администратор кликает на заявку
6. Экран: карточка заявки — все данные участника
   - Кнопки: "Одобрить", "Отклонить"
7. При отклонении → модальное окно: "Причина отклонения" (textarea, обязательно)
8. При одобрении → подтверждение → статус = "active", email участнику
9. При отклонении → статус = "rejected", email с причиной

### Подпоток: Модерация комиссаров
- Аналогично, но с дополнительными полями: опыт, регион, локации
- Одобрение → роль = "commissioner"

### Подпоток: Заявки организаций
- Таблица заявок организаций
- Одобрение + назначение комиссара (dropdown из списка комиссаров, отсортированных по близости к организации)
- После назначения → email организации и комиссару

**Альтернативные потоки:**
- A1: Нет новых заявок → "Нет заявок для рассмотрения"
- A2: Массовое одобрение → чекбоксы + "Одобрить выбранных"
- A3: Отклонение без причины → ошибка "Укажите причину отклонения"
- A4: Нет подходящего комиссара для организации → заявка остаётся в статусе "reviewing"

**Данные:**
- admin_action_log: {admin_id, action, target_type, target_id, comment, created_at}

**Acceptance criteria:**
- AC1: Только admin видит панель модерации
- AC2: Счётчики на Dashboard актуальны
- AC3: Отклонение требует причину
- AC4: Массовое одобрение работает корректно
- AC5: Все действия логируются (audit trail)
- AC6: Email отправляется при каждом решении
- AC7: Назначение комиссара для организации — с подсказкой ближайшего

---

## UC-17: Рейтинг-лист участников (публичный)

**Актор:** Гость / Участник / любой посетитель
**Цель:** Просмотреть рейтинг участников Ассоциации

**Предусловие:** Открыта страница "Рейтинг"

**Основной поток:**
1. Пользователь переходит на вкладку "Рейтинг"
2. Экран: таблица рейтинга
   - Колонки: #, ФИО, Страна (флаг + название), Рейтинг, Турниров сыграно, Динамика (up/down)
   - Сортировка по умолчанию: по рейтингу (высший первый)
   - Пагинация: 50 участников на страницу
3. Фильтры:
   - Страна (dropdown)
   - Поиск по имени (текстовое поле)
4. Пользователь кликает на строку участника
5. Popup или переход: мини-профиль с историей турниров (UC-18 для авторизованных, сокращённая версия для гостей)

**Альтернативные потоки:**
- A1: Нет участников → "Рейтинг-лист пуст"
- A2: Фильтр по стране без результатов → "Участников из {страна} нет в рейтинге"
- A3: Участник без турниров → рейтинг = 1200, турниров = 0, динамика = "--"

**Данные отображения:**
- rating_list: [{position, full_name, country, rating, tournaments_played, rating_trend}]
- rating_trend: last 3 tournaments (up/down/stable)
- page_size: 50

**Acceptance criteria:**
- AC1: Рейтинг-лист доступен без авторизации
- AC2: Сортировка по рейтингу по умолчанию
- AC3: Фильтрация по стране работает
- AC4: Поиск по имени работает (min 2 символа)
- AC5: Пагинация по 50 записей
- AC6: Динамика показывает тренд (стрелка вверх/вниз/минус)
- AC7: Страница < 3 секунд при 10,000+ участников

**Endpoint (реализовано — GET /api/ratings):**
- Пагинация: page (default 1), limit (default 50, max 100)
- Фильтр: ?country= (case-insensitive equals)
- Сортировка: effectiveRating DESC (fideRating если > 0, иначе rating)
- Доп. endpoints: GET /api/ratings/countries — список стран с count, GET /api/ratings/my — ранг текущего пользователя

**Данные в таблице (из кода):**
- rank: номер позиции (skip + idx + 1)
- userId: String
- name: String (user.name || 'Unknown')
- city: String | null
- country: String | null
- fideTitle: String | null
- rating: effectiveRating (число)
- tournamentCount: количество registrations со статусом APPROVED/PAID

**UI состояния:**
- **Loading:** LoadingSpinner при загрузке
- **Empty:** "Рейтинг-лист пуст"
- **Error:** Ошибка сети / server error
- **Success:** Таблица с пагинацией

**Гость видит:** Полную таблицу рейтинга без авторизации

**SEO:** Страница /ratings — публичная, индексируемая

**Edge cases:**
- Все пользователи загружаются в память для сортировки. При 10,000+ может быть медленно

---

## UC-18: История турниров участника

**Актор:** Участник
**Цель:** Просмотреть свою историю участия в турнирах

**Предусловие:** Участник авторизован, статус = "active"

**Основной поток:**
1. Участник в личном кабинете нажимает "Мои турниры"
2. Экран: список турниров в хронологическом порядке (новые первые)
   - Для каждого турнира:
     - Название турнира (ссылка на публичную страницу)
     - Дата проведения
     - Место проведения
     - Формат (классика/рапид/блиц)
     - Занятое место (1/2/3 выделены цветом: золото/серебро/бронза)
     - Очки
     - Рейтинг до → после (с дельтой: +N или -N)
   - Пагинация: 20 на страницу
3. Участник кликает на турнир → переход на публичную страницу турнира
   - Таблица всех участников, результаты, фото

**Альтернативные потоки:**
- A1: Нет турниров → "Вы ещё не участвовали в турнирах. Найти ближайший турнир?"
- A2: Турнир отменён → показывается с пометкой "Отменён", рейтинг не изменён
- A3: Турнир в процессе → показывается с пометкой "В процессе", результаты промежуточные

**Данные отображения:**
- tournament_history: [{tournament_name, date, location, format, place, points, rating_before, rating_after, status}]
- summary: {total_tournaments, best_place, current_rating, highest_rating}

**Acceptance criteria:**
- AC1: История показывает все турниры участника
- AC2: Рейтинг до/после корректный для каждого турнира
- AC3: 1/2/3 место визуально выделены
- AC4: Ссылки на публичные страницы турниров работают
- AC5: Пагинация по 20 записей
- AC6: Отменённые турниры помечены, рейтинг-дельта = 0

---

## UC-19: Онбординг-квиз (первый запуск)

> Status: deferred to backlog — No recommendation engine in v1. Quiz data would be unused. Preferences can be added to profile settings in a later iteration.

> Note (BizComplete): Убрать из AC3 упоминание рекомендательного движка — не реализован.

**Актор:** Новый пользователь (onboardingCompleted=false)
**Цель:** Персонализировать опыт на основе предпочтений

**Основной поток:**
1. После первого входа (UC-00) система проверяет onboardingCompleted
2. Если false → редирект на /quiz
3. Экран: опросник
   - Уровень игры: U1000 / U1400 / U1800 / 2000+ / Наблюдатель
   - Предпочитаемые страны (multi-select)
   - Опыт: Начинающий / Средний / Опытный
4. Данные сохраняются через POST /api/profile/preferences
5. onboardingCompleted=true → редирект на главный экран

**Acceptance criteria:**
- AC1: Квиз показывается только один раз при первом входе
- AC2: Можно пропустить (настройки по умолчанию)
- AC3: Предпочтения влияют на рекомендации турниров

---

## UC-20: Список отслеживаемых турниров (Watchlist)

**Актор:** Авторизованный участник
**Цель:** Сохранить турниры для отслеживания

**Основной поток:**
1. На странице турнира участник нажимает "добавить в watchlist" (heart icon)
2. POST /api/watchlist с tournamentId
3. Турнир появляется в разделе /watchlist
4. Для удаления: DELETE /api/watchlist/:tournamentId

**Acceptance criteria:**
- AC1: Кнопка watchlist доступна на странице и в списке турниров
- AC2: Один турнир = одна запись в watchlist (уникальность)
- AC3: GET /api/watchlist/ids используется для быстрой проверки состояния кнопок

**Endpoints (реализовано):**
- GET /api/watchlist — список с деталями турнира (title, city, country, startDate, endDate, status, fee, currency, ratingLimit, timeControl)
- GET /api/watchlist/ids — массив tournamentId (для быстрой проверки на карточках)
- POST /api/watchlist — body: {tournamentId}. Upsert (idempotent, без дупликатов)
- DELETE /api/watchlist/:tournamentId — deleteMany (soft, не ошибка если нет)

**Валидация (из кода):**
- tournamentId: required, string
- Tournament must exist (404 if not)
- Уникальность: @@unique([userId, tournamentId]) в Prisma

**UI состояния:**
- **Loading:** Спиннер на heart icon
- **Empty:** "Нет отслеживаемых турниров"
- **Success:** Heart icon заполнена (toggle state)

---

## UC-21: Уведомления (In-App)

> Note (BizComplete): Добавить типы: TOURNAMENT_COMPLETED, TOURNAMENT_CANCELLED, DIPLOMA_SENT, COMMISSIONER_APPROVED.

> Note (BizComplete): Extend notification_type enum to include all 7 types: REGISTRATION_APPROVED, REGISTRATION_REJECTED, PAYMENT_CONFIRMED, TOURNAMENT_COMPLETED, TOURNAMENT_CANCELLED, DIPLOMA_SENT, COMMISSIONER_APPROVED.

**Актор:** Авторизованный пользователь
**Цель:** Получать уведомления о важных событиях

**Типы уведомлений:**
- REGISTRATION_APPROVED — регистрация на турнир одобрена
- REGISTRATION_REJECTED — регистрация отклонена
- PAYMENT_CONFIRMED — комиссар подтвердил оплату наличными
- TOURNAMENT_COMPLETED — турнир завершён, результаты доступны
- TOURNAMENT_CANCELLED — турнир отменён
- DIPLOMA_SENT — грамота отправлена (1/2/3 место)
- COMMISSIONER_APPROVED — заявка комиссара одобрена
- SCHEDULE_UPDATED — расписание турнира обновлено (debounce 15 мин)
- TOURNAMENT_ANNOUNCEMENT — новое объявление от комиссара
- WATCHLIST_TOURNAMENT_OPEN — турнир из watchlist открыл регистрацию

**Основной поток:**
1. Событие происходит (одобрение регистрации и т.д.)
2. Система создаёт Notification запись
3. Пользователь видит бейдж на иконке уведомлений (GET /api/notifications/unread-count)
4. Пользователь открывает /notifications → список последних 20
5. PUT /api/notifications/:id/read или PUT /api/notifications/read-all

**Acceptance criteria:**
- AC1: Бейдж показывает количество непрочитанных (0 = скрыт)
- AC2: Уведомления создаются автоматически при соответствующих событиях
- AC3: Список пагинирован, новые первые

**Данные (Prisma Notification):**
- id: cuid, userId: String, type: String, title: String, body: String, isRead: Boolean @default(false), data: Json?, createdAt: DateTime
- Index: [userId, isRead]
- type — свободная строка (не enum в Prisma), фактически используемые: REGISTRATION_APPROVED, REGISTRATION_REJECTED, PAYMENT_CONFIRMED, PAYMENT_DISPUTED, SCHEDULE_UPDATED, TOURNAMENT_ANNOUNCEMENT, WATCHLIST_TOURNAMENT_OPEN

**Endpoints (из routes/notifications.ts):**
- GET /api/notifications — список (paginated)
- GET /api/notifications/unread-count — количество непрочитанных
- PUT /api/notifications/:id/read — отметить как прочитанное
- PUT /api/notifications/read-all — отметить все как прочитанные

**UI состояния:**
- **Loading:** Спиннер загрузки
- **Empty:** "Нет уведомлений"
- **Success:** Список уведомлений с badge непрочитанных

---

## UC-22: FIDE ID (текстовое поле)

> Note (SecOfficer): Per decision cache (UC-22-fide), FIDE scraping is removed. Implementation: user enters FIDE ID as free text field. System saves as text, no external lookup. Admin can manually note verification status.

**Актор:** Участник
**Цель:** Указать свой FIDE ID в профиле

**Предусловие:** Участник авторизован

**Основной поток:**
1. Участник в профиле (UC-01) вводит FIDE ID в текстовое поле
2. PUT /api/users/me с полем fideId (string, optional)
3. FIDE ID сохраняется как есть, без внешней проверки
4. В рейтинг-листе отображается FIDE ID рядом с именем

**Верификация FIDE:**
- Производится только администратором вручную
- Admin в панели может отметить fideVerified=true после ручной проверки

**Acceptance criteria:**
- AC1: Поле FIDE ID — текстовое, опциональное, max 20 символов
- AC2: Нет внешних API вызовов при сохранении
- AC3: Admin может установить fideVerified через /admin/users/:id
- AC4: Dev-режим: поле работает как обычный текст

---

## UC-23: Ввод результатов турнира (Комиссар)

> Note (Architect+SecOfficer 2026-04-06): Actor extended to include assistant commissioner (UC-NEW-08). Permission matrix: lead commissioner OR assistant = can enter results; ТОЛЬКО lead commissioner OR admin = can "Утвердить" (finalize → COMPLETED).

**Актор:** Комиссар (lead OR assistant) или Администратор
**Цель:** Зафиксировать итоговые результаты завершённого турнира

**Предусловие:** Турнир в статусе IN_PROGRESS

**Основной поток:**
1. Комиссар открывает страницу результатов турнира
2. Для каждого участника вводит: место (place), очки (score)
3. POST /api/tournaments/:id/results с массивом [{userId, place, score}]
4. Система рассчитывает eloChange для каждого участника (SYS-02)
5. Создаются TournamentResult записи, обновляются user.rating
6. Результаты доступны публично через GET /api/tournaments/:id/results

**Альтернативные потоки:**
- A5: Duplicate place numbers → validation error "Место X уже занято, введите другое"
- A6: Gaps in places (e.g. 1st and 3rd but no 2nd) → validation warning, commissioner confirms
- A7: After results confirmed → system automatically transitions tournament status to COMPLETED

**Acceptance criteria:**
- AC1: Только комиссар-владелец или admin может вводить результаты
- AC2: Только для турниров со статусом IN_PROGRESS
- AC3: ELO изменения рассчитываются автоматически

**Endpoint (реализовано — POST /api/tournaments/:id/results):**
- Требует: authenticate, requireRole('COMMISSIONER', 'ADMIN'), owner commissioner or admin
- Body: {results: [{userId, place, score}]}
- Валидация: results — non-empty array, каждый entry: userId (string), place (positive integer), score (number)
- Обработка: submitResults() → создание TournamentResult, расчёт ELO, обновление user.rating

**Данные (Prisma TournamentResult):**
- id: cuid, tournamentId: String, userId: String, place: Int, score: Float, eloChange: Int, createdAt: DateTime
- @@unique([tournamentId, userId])

**UI состояния:**
- **Loading:** Спиннер при отправке результатов
- **Empty:** Нет участников — "Добавьте минимум 2 участников"
- **Error:** "results must be a non-empty array" (400) / "Each result must have userId, place, score" (400) / "place must be a positive integer" (400) / "Not authorized" (403) / AppError от tournament.service
- **Success:** Результаты созданы (201), таблица отображается

---

## UC-26: История рейтинга (ELO History)

> Note (2026-04-06): Feature kept — fully implemented in code with UI button on /ratings page. Decision Cache UC-26 reverted to keep.

**Актор:** Любой пользователь
**Цель:** Просмотреть историю изменений рейтинга участника

**Основной поток:**
1. Пользователь открывает /ratings/history (или профиль участника)
2. GET /api/ratings/:userId/history
3. Список: турнир, место, очки, изменение ELO, дата

**Acceptance criteria:**
- AC1: Доступно без авторизации (публичная)
- AC2: Пагинация
- AC3: Показывает дельту (+N / -N) и итоговый рейтинг после каждого турнира

**Endpoint (реализовано — GET /api/ratings/:userId/history):**
- Пагинация: page (default 1), limit (default 20, max 100)
- Фильтр: только COMPLETED турниры (where: tournament.status = 'COMPLETED')
- Сортировка: tournament.endDate DESC
- Response: {data: [{tournamentId, tournamentName, place, score, eloChange, date}], pagination}

**UI состояния:**
- **Loading:** Спиннер
- **Empty:** "Нет истории рейтинга"
- **Success:** Таблица с пагинацией

**Гость видит:** Полную историю рейтинга любого пользователя без авторизации

---

## UC-24: Публичная страница турнира (детальная)

**Актор:** Гость / Участник
**Страница:** /tournaments/:id
**Цель:** Просмотреть полную информацию о турнире, зарегистрироваться

**Гость видит:**
- Заголовок, даты, город, страна, тип контроля, взнос
- Статус турнира (badge)
- Список участников (если публичный)
- Кнопка "Зарегистрироваться" → редирект на /login если не авторизован
- Фотографии (если загружены)
- Результаты (если статус COMPLETED)
- CTA "Войти чтобы зарегистрироваться" под кнопкой для гостей

**Основной поток:**
1. Гость/участник открывает /tournaments/:id
2. Система запрашивает GET /api/tournaments/:id
3. Отображается карточка турнира с полной информацией
4. Для статуса REGISTRATION_OPEN: кнопка "Зарегистрироваться"
5. Авторизованный пользователь нажимает → UC-28 (саморегистрация)
6. Для статуса COMPLETED: таблица результатов + фотогалерея

**Acceptance criteria:**
- AC-01: Страница доступна без авторизации для статусов PUBLISHED и выше
- AC-02: DRAFT статус — 404 для гостей, доступен только комиссару
- AC-03: Кнопка Register видна только при REGISTRATION_OPEN
- AC-04: Список участников виден для всех зарегистрированных
- AC-05: Результаты видны после COMPLETED
- AC-OG: Each tournament page has Open Graph meta tags: og:title (tournament name), og:description (city, dates, format), og:image (tournament photo or default logo). Enables rich previews in Telegram/WhatsApp/social media.

**Endpoint (реализовано — GET /api/tournaments/:id):**
- Optional auth: парсит Bearer token если есть, определяет userId
- Response: все поля турнира + commissioner (id, userId, country, city, photoUrl, user.name/surname) + registrationCount + participants [{id, user, paid, registeredAt}] + results [{id, rank, player, score, ratingChange}] + myRegistration (если авторизован)
- 404 если турнир не найден

**Данные в карточке:**
- Заголовок: title
- Даты: startDate — endDate (formatted)
- Локация: city, country
- Контроль времени: timeControl
- Взнос: fee + currency (или "Free")
- Макс. участников: maxParticipants (или неограниченно)
- Лимит рейтинга: ratingLimit (или "Open")
- Статус: badge (PUBLISHED, REGISTRATION_OPEN, IN_PROGRESS, COMPLETED, CANCELLED)
- Комиссар: name, photo, country, city (ссылка на профиль)
- Tabs: info / participants / results / photos

**UI состояния:**
- **Loading:** LoadingSpinner + RefreshControl (pull-to-refresh)
- **Empty:** 404 "Tournament not found"
- **Error:** Ошибка загрузки → сообщение
- **Success:** Полная карточка с табами

**SEO (из кода — Head from expo-router/head):**
- og:title: tournament.title
- og:description: "{city}, {dates}, {format}"
- Реализация: Head компонент в [id].tsx

**Гость видит:** Все данные кроме myRegistration (null). CTA "Зарегистрироваться" → редирект на /login. Tabs все доступны.

---

## UC-25: Главная страница (Landing / Home)

> BUG (UX Advocate): Ratings section использует entry.player.name но API возвращает flat entry.name. Задача #2308.

**Актор:** Гость / Участник
**Страница:** /
**Цель:** Первое впечатление, конверсия в регистрацию / просмотр турниров

**Гость видит:**
- Hero секция: заголовок, подзаголовок, CTA "Upcoming Tournaments"
- Секция ближайших турниров (up to 4, статус REGISTRATION_OPEN)
- Топ рейтинг (10 позиций)
- "How It Works" — 4 шага
- CTA cards: "Become a Commissar" + "Host a Tournament"

**Acceptance criteria:**
- AC-01: Страница полностью доступна без авторизации
- AC-02: Турниры загружаются через GET /api/tournaments?status=REGISTRATION_OPEN&limit=4
- AC-03: Рейтинг через GET /api/ratings?limit=10
- AC-04: Настройки hero (title/subtitle) через GET /api/settings/hero

**UI состояния:**
- **Loading:** Спиннеры на каждой секции
- **Empty:** Нет турниров → секция "Upcoming Tournaments" скрыта или показывает заглушку
- **Success:** Все секции загружены

**Гость видит:** Всю страницу полностью без авторизации. CTA-кнопки ведут на публичные страницы.

**Данные в карточке турнира (на главной):**
- title, startDate, endDate, city, country, status badge, fee

**SEO:** Главная страница — index, публичная

---

## UC-27: Каталог турниров (публичный список)

**Актор:** Гость / Участник
**Страница:** /tournaments
**Цель:** Найти и отфильтровать турниры

**Гость видит:**
- Список всех опубликованных турниров (PUBLISHED+)
- Фильтры: страна, тип контроля, дата, взнос (бесплатно/платно), статус
- Каждая карточка: название, даты, город, статус badge, взнос
- Пагинация или бесконечная прокрутка

**Acceptance criteria:**
- AC-01: Список доступен без авторизации
- AC-02: Фильтры через query params GET /api/tournaments?country=RU&status=REGISTRATION_OPEN
- AC-03: DRAFT турниры не отображаются

**Endpoint (реализовано — GET /api/tournaments):**
- where: status != DRAFT (по умолчанию)
- Фильтры: status, country (contains, insensitive), city (contains, insensitive), startFrom/startTo (date range), q (full-text search по title/description), ratingMax (lte + null = Open), timeControl (exact match)
- Пагинация: page (default 1), limit (default 20, max 100)
- Сортировка: startDate DESC
- Response: tournaments + pagination (page, limit, total, totalPages)

**Данные в карточке:**
- title, startDate/endDate, city, country, status badge, fee, currency, commissioner name, registrationCount

**UI состояния:**
- **Loading:** Спиннер загрузки
- **Empty:** "Турниров не найдено"
- **Success:** Список карточек с фильтрами

**Гость видит:** Все данные без авторизации. Кнопка регистрации ведёт на /login.

---

## UC-28: Саморегистрация участника на турнир

**Актор:** Участник (авторизован)
**Страница:** /tournaments/:id → /dashboard/payment/:id
**Цель:** Записаться на турнир со статусом REGISTRATION_OPEN

**Предусловие:** Пользователь авторизован, турнир имеет статус REGISTRATION_OPEN

**Основной поток:**
1. Участник нажимает кнопку "Зарегистрироваться" на /tournaments/:id
2. POST /api/tournaments/:id/register
3. Если турнир бесплатный → статус APPROVED → подтверждение
4. Если турнир платный → статус PENDING → редирект на /dashboard/payment/:id (UC-34)
5. Email уведомление: "Вы зарегистрированы на турнир X"

**Альтернативные потоки:**
- A1: Не авторизован → редирект на /(auth)/login с return URL
- A2: Уже зарегистрирован → сообщение "Вы уже участвуете"
- A3: Регистрация закрыта → кнопка disabled + сообщение

**Acceptance criteria:**
- AC-01: POST /api/tournaments/:id/register требует авторизации
- AC-02: Одна регистрация на турнир на участника (уникальность)
- AC-03: После регистрации участник виден комиссару в UC-07
- AC-04: Task #2008

**Endpoint (реализовано — POST /api/tournaments/:id/register):**
- Требует: authenticate
- Проверки: tournament exists, status in ['PUBLISHED', 'REGISTRATION_OPEN'], maxParticipants не превышен, ratingLimit не превышен, нет дублирования
- Бесплатный турнир (fee=0): transaction → registration(status=PAID) + payment(amount=0, status=PAID) + sendThankYouEmail (fire-and-forget)
- Платный турнир: registration(status=PENDING), ожидает оплату

**Валидация (из кода):**
- Tournament status: must be in REGISTRABLE_STATUSES = ['PUBLISHED', 'REGISTRATION_OPEN']
- Max participants: _count.registrations >= maxParticipants → 400 "Tournament is full"
- Rating limit: user.rating > ratingLimit → 400 "Your rating exceeds the limit of {ratingLimit}"
- Duplicate: existing registration → 409 "Already registered for this tournament"

**UI состояния:**
- **Loading:** Кнопка "Зарегистрироваться" со спиннером
- **Error:** "Tournament is not open for registration" / "Tournament is full" / "Your rating exceeds the limit" / "Already registered for this tournament"
- **Success:** Registration created (201), redirect на payment page если платный

**Уведомления (бесплатный турнир):**
- Email: sendThankYouEmail() — "Thank you for participating in {tournamentName}!"

---

## UC-29: Каталог комиссаров (список)

**Актор:** Гость / Участник
**Страница:** /commissars
**Цель:** Найти комиссара по стране/городу

**Гость видит:**
- Карточки верифицированных комиссаров
- Фильтр по стране
- Каждая карточка: фото, имя, страна, город, кол-во турниров

**Acceptance criteria:**
- AC-01: Список доступен без авторизации
- AC-02: Только isVerified=true комиссары
- AC-03: GET /api/commissars?country=RU&verified=true

**Данные в карточке комиссара:**
- Фото (photoUrl) или дефолтный аватар
- Имя (user.name + user.surname)
- Страна (country)
- Город (city)
- Количество турниров (tournaments count)
- Bio (bio, если есть)

**UI состояния:**
- **Loading:** Спиннер
- **Empty:** "Нет зарегистрированных комиссаров"
- **Success:** Карточки комиссаров

**Гость видит:** Все данные без авторизации. Фильтр по стране.

---

## UC-30: Панель администратора (Dashboard + CRUD)

> Note (AdminMirror): Refund handling for cancelled tournaments: status change is automated, but monetary refunds are processed manually by admin via Stripe Dashboard. No automated refund API calls in v1. Admin should see payment details and Stripe payment_intent_id to facilitate manual refund.

**Актор:** Администратор
**Страница:** /admin, /admin/users, /admin/tournaments, /admin/finances, /admin/organizations, /admin/moderation
**Цель:** Полный контроль над системой

**Основной поток (пользователи):**
1. GET /api/admin/users — список всех пользователей
2. Поиск по email/имени
3. Просмотр профиля → смена роли → бан/разбан

**Основной поток (турниры):**
1. GET /api/admin/tournaments — все турниры
2. Редактирование любого турнира
3. Принудительная отмена (CANCELLED) с нотификацией участников

**Основной поток (финансы):**
1. GET /api/admin/finances — статистика платежей
2. Итого наличными / через Stripe по периодам
3. Список неоплаченных

**Acceptance criteria:**
- AC-01: Все /admin/* требуют роль ADMIN
- AC-02: Audit log для всех admin actions
- AC-03: Финансы: разбивка cash vs stripe vs pending

**Страницы (из Screen Inventory):**
- /(admin) — Dashboard с счётчиками
- /(admin)/users — CRUD пользователей
- /(admin)/tournaments — все турниры
- /(admin)/finances — платежи (UC-35)
- /(admin)/organizations — заявки организаций
- /(admin)/moderation — модерация заявок

**Endpoints (из routes/admin.ts):**
- GET /api/admin/users — список пользователей (поиск по email/name)
- GET /api/admin/tournaments — все турниры
- GET /api/admin/finances — статистика платежей
- PATCH /api/admin/users/:id — смена роли, бан
- Все admin endpoints: authenticate + requireRole('ADMIN')

**UI состояния:**
- **Loading:** Спиннеры на каждой секции
- **Empty:** "Нет данных"
- **Error:** 403 если не ADMIN

---

## UC-31: Управление турнирами комиссара

> Note (Architect): UC-06 status enum must be aligned with this state machine. Required states: DRAFT, PUBLISHED, REGISTRATION_OPEN, REGISTRATION_CLOSED, IN_PROGRESS, COMPLETED, CANCELLED. Update UC-06 data model accordingly.

**Актор:** Комиссар
**Страница:** /(dashboard)/tournaments/manage, /(dashboard)/tournaments/my-tournaments
**Цель:** Обзор и управление своими турнирами

**Основной поток:**
1. Список турниров комиссара с фильтром по статусу
2. Для каждого: статус, кол-во участников, дата начала
3. Быстрые действия: Publish / Start / Complete / Cancel
4. Переход в детали турнира (edit, participants, results, photos)

**Acceptance criteria:**
- AC-01: Только турниры текущего комиссара
- AC-02: State machine: DRAFT→PUBLISHED→REGISTRATION_OPEN→IN_PROGRESS→COMPLETED/CANCELLED

---

## UC-32: Мои регистрации (участник)

> Note (2026-04-06): Отмена регистрации запрещена (UC-NEW-03-participant-cancel decision confirmed). Кнопка отмены НЕ должна быть в UI.

**Актор:** Участник
**Страница:** /(dashboard)/my-registrations
**Цель:** Просмотреть список своих регистраций на турниры

**Основной поток:**
1. GET /api/profile/registrations — список регистраций
2. Для каждой: турнир, даты, статус (PENDING/APPROVED/PAID/REJECTED), взнос

**Acceptance criteria:**
- AC-01: Только свои регистрации
- AC-02: Статус оплаты виден
- AC-03: Отмена регистрации не предусмотрена (no-cancel policy). Участник может связаться с комиссаром напрямую.

**Endpoint (реализовано — GET /api/my-registrations):**
- Требует: authenticate
- Response: массив registrations с tournament data (id, title, city, country, startDate, endDate, status)
- Сортировка: createdAt DESC

**Данные в карточке регистрации:**
- Турнир: title (ссылка на /tournaments/:id)
- Даты: startDate — endDate
- Город/Страна: city, country
- Статус регистрации: PENDING / APPROVED / REJECTED / PAID (badge)
- Статус турнира: tournament.status

**UI состояния:**
- **Loading:** Спиннер
- **Empty:** "Вы ещё не зарегистрированы ни на один турнир"
- **Success:** Список регистраций

---

## UC-33: Публичный профиль пользователя

**Актор:** Гость / Участник
**Страница:** /users/:id
**Цель:** Просмотреть публичный профиль участника

**Гость видит:**
- Имя, страна, рейтинг
- История турниров (завершённые)
- Статистика: победы/ничьи/поражения

**Acceptance criteria:**
- AC-01: Страница доступна без авторизации
- AC-02: Личные данные (email) не показываются
- AC-03: GET /api/users/:id (публичные поля)

**Данные на публичном профиле:**
- name, surname, country, city, rating, fideRating, fideTitle, photoUrl
- История турниров (completed): из TournamentResult (tournamentName, place, score, eloChange)
- Email и phone: НЕ показываются

**UI состояния:**
- **Loading:** Спиннер
- **Empty:** Нет турниров → "Пока нет турниров"
- **Error:** 404 "User not found"
- **Success:** Профиль с данными

**Гость видит:** Полный профиль без авторизации. Без email/phone.

**SEO:** Публичная страница /users/:id

---

## UC-34: Страница оплаты турнирного взноса

**Актор:** Участник
**Страница:** /(dashboard)/payment/:tournamentId
**Цель:** Оплатить взнос для участия в турнире

**Основной поток (Stripe):**
1. GET /api/tournaments/:id — получить размер взноса
2. POST /api/payments/create-intent — создать Stripe PaymentIntent
3. Stripe Elements form — ввод карты
4. Подтверждение → POST /api/payments/confirm
5. Статус регистрации → PAID
6. Редирект на /payment-success

**Альтернативные потоки:**
- A1: Если взнос уже оплачен → показать статус PAID
- A2: Payment failed → retry или cancel

**Acceptance criteria:**
- AC-01: Сумма берётся с сервера, не из URL параметров
- AC-02: Stripe webhook подтверждает оплату независимо от фронта
- AC-03: Task #1978/#1709

**Endpoint (реализовано — POST /api/payments/tournament/:tournamentId):**
- Создаёт Stripe Checkout Session (не PaymentIntent Elements)
- Redirect-based flow: success_url → /payment-success?tournamentId={id}
- Нет Stripe Elements формы на клиенте — redirect на hosted Checkout page

**Дополнительный endpoint:** GET /api/payments/my — список платежей текущего пользователя с деталями турнира

**UI состояния:**
- **Loading:** Redirect на Stripe Checkout
- **Empty:** Информация о турнире + сумма + кнопка "Pay Now"
- **Error:** "Registration must be approved before payment" / "Registration is already paid" / "This tournament is free"
- **Success:** /payment-success?tournamentId={id} — "Оплата прошла успешно!"

---

## SYS-02: ELO Rating Calculation System

**Актор:** СИСТЕМА (trigger: tournament complete)
**Цель:** Пересчитать рейтинги всех участников после завершения турнира

**API:** POST /api/system/calculate-ratings/:tournamentId

**Основной поток:**
1. Турнир переходит в статус COMPLETED (UC-31)
2. СИСТЕМА берёт финальные места из UC-23 (standings)
3. Начальный рейтинг новых игроков: 1200
4. K-фактор: 40 (< 2100), 20 (2100-2400), 10 (> 2400)
5. Расчёт ELO по формуле для каждого участника (результат = очки / max_очки)
6. Сохранение нового рейтинга + запись в историю (RatingHistory)
7. Нотификация участникам о смене рейтинга (если изменение > 20 пунктов)

**Acceptance criteria:**
- AC-01: Пересчёт только один раз (idempotency check)
- AC-02: Рейтинг не опускается ниже 100
- AC-03: История сохраняется в таблицу rating_history

---

## SYS-03: Email Service + Templates + Queue

**Актор:** СИСТЕМА
**Цель:** Надёжная доставка email для всех событий системы

**API:** Internal service, no public endpoint

**Шаблоны:**
- OTP code (UC-00)
- Tournament invitation (UC-07)
- Registration confirmed (UC-28)
- Payment confirmed (UC-34)
- Diploma/certificate (UC-12)
- Commissioner approved (UC-02)
- Tournament cancelled
- Schedule update (UC-NEW-10) — debounce 15 мин
- Tournament announcement (UC-NEW-11)
- Watchlist tournament open (UC-NEW-05)

**Основной поток:**
1. Событие тригерит email job → добавляется в очередь (BullMQ / Redis)
2. Worker обрабатывает job → отправляет через SMTP (nodemailer)
3. При ошибке: retry 3 раза × 5 мин
4. Dev режим: вместо отправки — console.log шаблона

**Acceptance criteria:**
- AC-01: Dev режим: OTP всегда в console.log (не отправляется)
- AC-02: Retry queue с dead-letter после 3 попыток
- AC-03: Task #2009

**Реализация (из кода):**
- Email provider: Brevo API (не SMTP/nodemailer). brevoSend() через fetch POST https://api.brevo.com/v3/smtp/email
- API key: env BREVO_API_KEY (Doppler)
- FROM: noreply@diagrams.love (FROM_NAME: "ChesTourism")
- Schedule debounce: BullMQ Worker в lib/scheduleQueue.ts — delayed job 15 мин для schedule change emails
- Retry queue для остальных: НЕ РЕАЛИЗОВАНА — email отправляется синхронно, при ошибке throw

**Шаблоны (реализовано в email.service.ts):**
- sendOtpEmail(email, code) — "Your ChesTourism login code", code 32px bold
- sendTournamentInvite(to, userName, tournamentName, tournamentDate, registrationUrl)
- sendCommissarApproval(to, userName, approved, comment?)
- sendTournamentResults(to, userName, tournamentName, place, eloChange)
- sendThankYouEmail(to, userName, tournamentName) — "Thank you for participating"
- sendOrganizationRequestDecision(to, contactName, organizationName, approved, reason?)
- sendScheduleChangeEmail(to, userName, tournament) — debounce 15 мин
- sendResultsWithCertificate(to, userName, tournamentName, place, eloChange, certificatePdf) — PDF в attachment

---

## UC-iCal: Экспорт турнира в календарь

> Status: deferred to backlog. MVP Guardian: нет кода, нет спроса. GET /api/tournaments/:id/ical реализуется по запросу.

**Актор:** Гость / Участник
**Страница:** /tournaments/:id (кнопка)
**Цель:** Добавить турнир в Google Calendar / iCal

**Основной поток:**
1. Кнопка "Add to Calendar" на странице турнира
2. GET /api/tournaments/:id/ical → возвращает .ics файл
3. Браузер скачивает / открывает в приложении Calendar

**Acceptance criteria:**
- AC-01: Формат iCalendar (RFC 5545)
- AC-02: Поля: DTSTART, DTEND, SUMMARY, LOCATION, DESCRIPTION
- AC-03: Работает без авторизации

---

## UC-NEW-05: Tournament Status State Machine

**Актор:** System / Commissioner / Admin
**Цель:** Единый источник правды для всех переходов статусов турнира

**Статусы (полный enum):**
- `DRAFT` — создан, не опубликован
- `PUBLISHED` — опубликован, регистрация не открыта
- `REGISTRATION_OPEN` — регистрация открыта (до даты начала или max_participants)
- `REGISTRATION_CLOSED` — регистрация закрыта, турнир ещё не начался
- `IN_PROGRESS` — турнир идёт
- `COMPLETED` — результаты внесены (UC-23), дипломы отправлены (UC-12)
- `CANCELLED` — отменён (UC-NEW-01)

**Переходы:**

| От | К | Кто | Триггер |
|---|---|---|---|
| DRAFT | PUBLISHED | Commissioner | Нажать "Опубликовать" (UC-31) |
| PUBLISHED | REGISTRATION_OPEN | Commissioner | Нажать "Открыть регистрацию" (UC-31) |
| REGISTRATION_OPEN | REGISTRATION_CLOSED | System/Commissioner | Дата закрытия OR max_participants OR ручное закрытие |
| REGISTRATION_CLOSED | IN_PROGRESS | Commissioner | Нажать "Начать турнир" (UC-31) |
| IN_PROGRESS | COMPLETED | System | После подтверждения результатов (UC-23) |
| ANY (except COMPLETED) | CANCELLED | Commissioner/Admin | Отмена (UC-NEW-01) |

**Side effects on transition:**
- → REGISTRATION_OPEN: email всем пользователям из watchlist (UC-20)
- → REGISTRATION_CLOSED: email всем зарегистрированным участникам
- → COMPLETED: trigger UC-12 (дипломы), email участникам с результатами
- → CANCELLED: email всем зарегистрированным, статус регистраций → CANCELLED

**Acceptance criteria:**
- AC1: Переходы строго по таблице выше, невалидные транзиции → 400 Bad Request
- AC2: UC-06 status enum = эти 7 статусов
- AC3: UC-31 state machine buttons aligned с этой таблицей

---

## UC-NEW-06: Guest-to-Auth Redirect with Return URL

**Актор:** Гость
**Цель:** После аутентификации вернуться на страницу, с которой пришёл

**Основной поток:**
1. Гость находится на /tournaments/:id, нажимает "Зарегистрироваться"
2. Система редиректит на /auth?returnUrl=/tournaments/123/register
3. Гость проходит OTP аутентификацию (UC-00)
4. После успешного входа: если returnUrl задан — редирект на returnUrl
5. Если returnUrl не задан: обычный флоу UC-00 (onboarding check → dashboard)

**Альтернативные потоки:**
- A1: returnUrl содержит внешний домен → игнорировать, редирект на dashboard (security)
- A2: returnUrl на защищённую страницу, к которой у роли нет доступа → 403

**Acceptance criteria:**
- AC1: returnUrl передаётся как query param в /auth
- AC2: После успешного OTP верификации — редирект на returnUrl (если валидный)
- AC3: returnUrl должен быть относительным путём (начинается с /), внешние URL игнорируются
- AC4: Работает для всех точек входа: кнопки "Войти" с любой страницы

**Реализация (из кода):**
- login.tsx: `const { returnUrl } = useLocalSearchParams<{ returnUrl?: string }>()`
- Передача: `router.push({ pathname: '/(auth)/otp', params: { email, returnUrl: returnUrl || '' } })`
- otp.tsx: после verifyOtp → `router.replace((returnUrl || '/') as any)`
- Валидация returnUrl: НЕ РЕАЛИЗОВАНА на клиенте. returnUrl подставляется as-is в router.replace. Внешние URL не фильтруются.

---

## UC-NEW-07: Commissioner Profile Editing

**Актор:** Комиссар (authenticated, role=commissioner)
**Страница:** /dashboard/commissioner/profile
**Цель:** Комиссар обновляет свой публичный профиль после получения статуса

**Гость видит:** Редирект на /login

**Основной поток:**
1. Комиссар переходит в личный кабинет → вкладка "Мой профиль"
2. Форма редактирования:
   - Аватар (загрузка фото)
   - Краткое bio (текст, до 500 символов)
   - Города работы (до 3, текстовые поля)
   - Достижения/опыт (текст, до 1000 символов)
   - Ссылки: сайт, телеграм (опционально)
3. Комиссар нажимает "Сохранить"
4. Данные обновляются, публичный профиль /commissioner/:id отражает изменения

**Acceptance criteria:**
- AC1: Форма доступна только пользователям с role=commissioner
- AC2: Изменения немедленно отражаются на публичном профиле
- AC3: Аватар: max 5MB, форматы JPG/PNG, хранится в S3/MinIO
- AC4: Bio и achievements — XSS-safe (sanitize HTML input)
- AC5: До 3 городов работы (строка, не геокодинг)

**Страницы (реализовано):**
- /(dashboard)/commissioner/index.tsx — кабинет комиссара
- /(dashboard)/commissioner/edit.tsx — редактирование профиля

**Вложения/Медиа:**
- Avatar upload: POST /api/profile/avatar, multer memoryStorage, validateAndUpload('avatar')
- Форматы: JPG/PNG/WebP, max 5MB
- Хранение: S3/MinIO prefix "avatars/{uuid}.{ext}"

**UI состояния:**
- **Loading:** Спиннер при загрузке/сохранении
- **Error:** Upload validation errors (wrong MIME, size exceeded)
- **Success:** Профиль обновлён, изменения видны на публичной странице /commissars/:id

---

## UC-NEW-01: Tournament Cancellation

**Актор:** Commissioner / Admin
**Цель:** Отменить турнир и уведомить участников

**Предусловие:** Турнир в статусе отличном от COMPLETED

**Основной поток:**
1. Commissioner/Admin нажимает "Отменить турнир" в дашборде
2. Система показывает confirmation dialog: "Вы уверены? Все участники будут уведомлены."
3. После подтверждения:
   - Статус турнира → CANCELLED
   - Статус всех регистраций → CANCELLED
   - Email всем зарегистрированным участникам: "Турнир {name} отменён. Свяжитесь с комиссаром по вопросам возврата средств."
4. Турнир скрывается из публичного каталога (или показывается с badge CANCELLED)

**Возвраты (refund policy):**
- Возвраты НЕ автоматизированы в v1
- Администратор обрабатывает возвраты вручную через Stripe Dashboard
- Email участникам содержит контакт комиссара для уточнения возврата
- В admin панели: список платежей по отменённому турниру с payment_intent_id для ручного возврата

**Альтернативные потоки:**
- A1: Турнир IN_PROGRESS → доп. предупреждение "Турнир уже идёт"
- A2: У турнира нет зарегистрированных → отмена без email-рассылки

**Acceptance criteria:**
- AC1: Статус → CANCELLED, регистрации → CANCELLED
- AC2: Email всем участникам с информацией об отмене
- AC3: Admin видит список платежей турнира с payment_intent_id
- AC4: Комиссар не может отменить COMPLETED турнир
- AC5: Возвраты — только через Stripe Dashboard, не через систему

---

## SYS-04: Stripe Webhook Handler

> Note (Architect 2026-04-06): Code uses `checkout.session.completed` (Checkout Session flow), NOT `payment_intent.succeeded`. UC updated to match implementation.

**Актор:** СИСТЕМА (Stripe → Backend)
**Цель:** Обрабатывать события Stripe, обновлять статусы платежей

**Endpoint:** POST /api/webhooks/stripe

**КРИТИЧНО — Raw Body:**
- Webhook route MUST receive raw body
- Mount `express.raw({ type: 'application/json' })` BEFORE `express.json()` middleware
- Without raw body: signature verification fails for ALL webhooks

**Безопасность:**
- Верификация подписи: `stripe.webhooks.constructEvent(rawBody, sig, STRIPE_WEBHOOK_SECRET)`
- Webhook Secret в env: STRIPE_WEBHOOK_SECRET (Doppler)
- Если подпись невалидна → 400 Bad Request, логировать попытку
- Replay attack tolerance: 300 секунд (Stripe SDK default — не переопределять)

**Обрабатываемые события:**

| Event | Действие |
|-------|---------|
| `checkout.session.completed` | Найти payment по metadata.tournamentId+userId → registration.status = PAID, отправить confirmation email |
| `checkout.session.expired` | Registration → PAYMENT_FAILED, email участнику "Сессия оплаты истекла" |
| `charge.refunded` | Обновить payment record → status = REFUNDED (manual refund via Stripe Dashboard) |
| `charge.dispute.created` | Payment → DISPUTED, уведомить admin (SYS-06) |

**RegistrationStatus flow (Stripe path):**
- Participant регистрируется → PENDING
- Комиссар добавляет вручную → APPROVED (платный) / PAID (бесплатный, см. UC-NEW-12)
- checkout.session.completed → PAID
- checkout.session.expired → PAYMENT_FAILED

**Idempotency:**
- Хранить обработанные Stripe event ID в таблице webhook_events
- Если event_id уже в таблице → ответить 200 (idempotent), не обрабатывать повторно
- Таблица: {id, stripe_event_id, type, processed_at, status}
- ВАЖНО: таблица webhook_events должна быть добавлена в Prisma schema

**Dead Letter Logging:**
- Необработанные типы событий → логировать с full payload, возвращать 200 OK

**Acceptance criteria:**
- AC1: Raw body middleware установлен ДО express.json на webhook route
- AC2: Подпись верифицируется для каждого запроса (400 при invalid sig)
- AC3: Idempotent обработка через webhook_events table
- AC4: checkout.session.completed → registration PAID в течение 5 секунд
- AC5: Ошибка обработки → 500 (Stripe повторит через exponential backoff)
- AC6: Все webhook events логируются в БД
- AC7: charge.dispute.created → триггер SYS-06

**Реализация (из payments.ts):**
- Raw body: express.raw({ type: 'application/json' }) mounted BEFORE express.json() в index.ts
- Signature: stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
- Обрабатываемые события (реально в коде):
  - checkout.session.completed → payment PAID + registration PAID + webhookEvent (в $transaction)
  - payment_intent.payment_failed → payment FAILED + webhookEvent
  - charge.dispute.created → payment DISPUTED + admin notifications
- Dead Letter: при ошибке DB → webhookEvent с status='failed', errorMessage, rawRef
- Idempotency: webhookEvent.findUnique({where: {stripeEventId: event.id}}) → skip если есть

**Данные (Prisma WebhookEvent):**
- id: cuid, stripeEventId: String @unique, processedAt: DateTime, eventType: String?, status: String @default("processed"), errorMessage: String?, rawRef: String?

**Rate Limiting:**
- express-rate-limit: 100 req / 15 мин на /api/ (general)
- Webhook endpoint: no special rate limit (Stripe manages retry backoff)

---

## UC-NEW-08: Multi-Commissioner Assignment on Tournament

> Note (SecOfficer 2026-04-06): Assistant whitelist transitions: register participants, mark cash payment, enter round results, post announcements. НЕ разрешено: смена статуса турнира (кроме записи результатов раунда), удаление участников, финализация результатов.

**Актор:** Lead Commissioner / Admin
**Страница:** /dashboard/tournament/:id/team
**Цель:** Назначить дополнительных комиссаров на конкретный турнир

**Роли:**
- **Lead Commissioner** — создатель турнира, полные права
- **Assistant Commissioner** — может: регистрировать участников, принимать наличные, вводить результаты раундов, постить объявления

**Гость видит:** Редирект на /login

**Основной поток:**
1. Lead открывает турнир → вкладка "Команда"
2. Список назначенных комиссаров (lead + ассистенты)
3. "Добавить комиссара" → поиск среди role=commissioner
4. Назначает как ассистент → ассистент получает email "Вас назначили на турнир {name}"
5. Турнир появляется в dashboard ассистента

**Альтернативные потоки:**
- A1: Lead удаляет ассистента → email + турнир пропадает из его dashboard
- A2: Admin может назначать/снимать комиссаров на любой турнир

**Данные:**
- tournament_commissioners: {tournament_id, commissioner_id, role: lead|assistant, assigned_at}

**Acceptance criteria:**
- AC1: У турнира всегда ровно 1 lead commissioner
- AC2: Ассистентов — от 0 до N без ограничений
- AC3: Ассистент видит турнир в своём dashboard и может управлять в рамках своих прав
- AC4: Только lead и admin добавляют/удаляют ассистентов
- AC5: Публичная страница турнира показывает всех назначенных комиссаров

**Статус реализации:** НЕ РЕАЛИЗОВАНО. Prisma schema не содержит модели tournament_commissioners. Сейчас turament.commissionerId — один комиссар (FK Commissioner). Требуется:
- Новая модель TournamentCommissioner: {tournament_id, commissioner_id, role: LEAD|ASSISTANT, assigned_at}
- Миграция: перенести текущий commissionerId как LEAD
- Endpoints: POST/DELETE /api/tournaments/:id/commissioners
- Permission matrix: проверка LEAD vs ASSISTANT в каждом endpoint

---

## UC-NEW-09: Tournament Rounds & Match Results Entry

**Актор:** Commissioner (lead или assistant)
**Страница:** /dashboard/tournament/:id/results
**Цель:** Ввести результаты матчей по раундам, система автоматически считает итоговую таблицу

**Предусловие:** Турнир в статусе IN_PROGRESS, пользователь — назначенный комиссар

**Гость видит:** Итоговую таблицу на публичной странице (только после COMPLETED)

**Основной поток — создание раунда:**
1. "Добавить раунд" → название (Раунд 1, Тур 1, Финал), дата/время
2. Раунд создан, список партий пуст

**Основной поток — ввод партии:**
1. "Добавить партию" → выбрать Белые + Чёрные из зарегистрированных участников
2. Результат: 1-0 (победа белых) / ½-½ (ничья) / 0-1 (победа чёрных) / — (bye)
3. Сохранить

**Автоматический расчёт таблицы:**
- Победа = 1 очко, Ничья = 0.5, Поражение = 0, Bye = 0
- Итоговая таблица: место | участник | страна | очки | +/=/−
- При равенстве очков — алфавитный порядок (v1, Buchholz в v2)
- Места 1/2/3 определяются автоматически

**Подтверждение итогов:**
1. "Подтвердить итоги" → финальная таблица на подтверждение
2. "Утвердить" → статус турнира → COMPLETED → триггер UC-12 (дипломы)

**Альтернативные потоки:**
- A1: Редактирование результата партии возможно до "Утвердить"
- A2: После "Утвердить" — правки только через admin
- A3: Если раунды не вводились — ручное указание мест 1/2/3 (формат "other")

**Данные:**
- tournament_rounds: {id, tournament_id, name, round_number, scheduled_at}
- tournament_games: {id, round_id, white_player_id, black_player_id, result: white_win|draw|black_win|bye}
- standings: вычисляется на лету из tournament_games

**Acceptance criteria:**
- AC1: Результаты вводятся только для зарегистрированных участников этого турнира
- AC2: Один участник не может играть дважды в одном раунде
- AC3: Таблица пересчитывается мгновенно после каждой введённой партии
- AC4: После "Утвердить" → места 1/2/3 передаются в UC-12 (дипломы)
- AC5: Публичная страница показывает итоговую таблицу после COMPLETED
- AC6: Промежуточные результаты видны только комиссарам (до подтверждения)

**Статус реализации:** НЕ РЕАЛИЗОВАНО. Prisma schema не содержит моделей tournament_rounds / tournament_games. Требуется:
- Новая модель TournamentRound: {id, tournament_id, name, round_number, scheduled_at}
- Новая модель TournamentGame: {id, round_id, white_player_id, black_player_id, result: enum}
- Endpoints: CRUD для раундов и партий
- Frontend: экран /(commissioner)/[id]/rounds

---

## UC-NEW-10: Tournament Schedule (Detailed Program)

> Note (BizComplete 2026-04-06): Email при изменении расписания — debounce 15 минут через BullMQ delayed job. При каждом изменении: отменяем предыдущий job, ставим новый через 15 мин. Одно письмо с итоговым расписанием вместо спама.

**Актор:** Commissioner
**Страница:** /dashboard/tournament/:id/schedule / /tournaments/:id таб "Расписание"
**Цель:** Создать программу мероприятия, публично видимую

**Гость видит:** Расписание полностью, без авторизации

**Основной поток:**
1. Комиссар → "Расписание" в dashboard → "Добавить событие"
2. Форма: название, дата/время начала, время конца (опц.), тип (ceremony|round|break|other), описание (до 300 симв., опц.), место (опц.)
3. Сохранить → хронологический список
4. Публичная страница: таб "Расписание" с timeline

**Данные:**
- tournament_schedule_items: {id, tournament_id, title, start_at, end_at, type, description, location, created_by}

**Acceptance criteria:**
- AC1: Расписание публично без авторизации
- AC2: Хронологический порядок (по start_at)
- AC3: Комиссар может редактировать и удалять пункты в любой момент
- AC4: Тип события = иконка/цвет в UI
- AC5: При добавлении или изменении любого пункта расписания → email всем зарегистрированным участникам: "Расписание турнира {name} обновлено" + ссылка на страницу турнира
- AC6: In-app уведомление (тип SCHEDULE_UPDATED) всем зарегистрированным участникам
- AC7: Расписание редактируется прямо со страницы турнира в dashboard (не отдельная страница)

**Статус реализации:** ЧАСТИЧНО РЕАЛИЗОВАНО. Email debounce через BullMQ (lib/scheduleQueue.ts) работает. Но:
- Prisma schema НЕ содержит модели tournament_schedule_items
- Endpoints CRUD для расписания: НЕ РЕАЛИЗОВАНЫ
- Frontend: MISSING экран /tournaments/:id/schedule

**Реализовано:** debounceScheduleEmail() вызывается при PUT /api/tournaments/:id (если изменились scheduleFields: startDate, endDate, title, city, country, fee) — отправляет sendScheduleChangeEmail всем зарегистрированным участникам через 15-минутную задержку

---

## UC-NEW-11: Tournament Announcements Feed

**Актор:** Commissioner (lead/assistant) / Admin → читатели: все
**Страница:** /tournaments/:id → раздел "Объявления"
**Цель:** Важные официальные сообщения от организаторов для всех участников турнира (изменения, новости, напоминания). Участники получают уведомления.

**Гость видит:** Все объявления, read-only, без авторизации

**Основной поток — публикация:**
1. Комиссар в dashboard → "Объявления" → текст (до 1000 симв., опц. ссылка)
2. "Опубликовать" → мгновенно появляется
3. Email всем зарегистрированным участникам: "Объявление по турниру {name}"
4. In-app уведомление (тип TOURNAMENT_ANNOUNCEMENT)

**Основной поток — чтение:**
1. Вкладка "Объявления" на публичной странице турнира — лента, новые сверху
2. Каждое: аватар комиссара, имя, дата, текст
3. В личном кабинете участника — badge непрочитанных

**Альтернативные потоки:**
- A1: Admin публикует → подписано "Администрация федерации"
- A2: Комиссар удаляет своё объявление (soft delete)

**Данные:**
- tournament_announcements: {id, tournament_id, author_id, author_role, content, external_link, created_at, deleted_at}

**Acceptance criteria:**
- AC1: Публиковать могут только назначенные комиссары и admin
- AC2: Email-уведомление всем registered участникам (один email per participant per announcement)
- AC3: Лента публично без авторизации
- AC4: Badge непрочитанных в dashboard участника
- AC5: Idempotent уведомления (хранить announcement_notification_sent)

**Статус реализации:** НЕ РЕАЛИЗОВАНО. Prisma schema не содержит модели tournament_announcements. Требуется:
- Новая модель TournamentAnnouncement: {id, tournament_id, author_id, author_role, content, external_link, created_at, deleted_at}
- Endpoints: CRUD
- Notification: createNotification с типом TOURNAMENT_ANNOUNCEMENT
- Email: отдельный шаблон для announcement
- Frontend: MISSING экран /tournaments/:id/announcements

---

## SYS-05: File Upload Service

> Note (Architect 2026-04-06): MVP scope clarification: (1) Image resize deferred — files stored as-is. (2) Signed URLs deferred — all assets use public URLs in MVP. (3) Cron cleanup deferred. Remove AC3/AC4/AC5 from MVP scope or mark as post-MVP.

**Актор:** СИСТЕМА (внутренний сервис)
**Цель:** Централизованная обработка файлов для UC-09 (фото), UC-NEW-07 (аватар), UC-05 (PDF)

**Endpoint:** POST /api/upload (internal middleware)

**Правила валидации:**
- Images: JPG/PNG/WebP, max 10MB (фото турнира) / 5MB (аватар)
- PDFs: только генерируемые системой (не загружаемые)

**Обработка:**
- ~~Resize до max 1920px по большей стороне (для изображений)~~ **[post-MVP]**
- Сохранение в S3/MinIO с уникальным ключом (UUID)
- Возврат public URL ~~или signed URL (для приватных файлов)~~ **[post-MVP: signed URLs]**
- ~~Cleanup: orphaned files (не связанные с сущностями) удаляются через cron~~ **[post-MVP]**

**Acceptance criteria:**
- AC1: Единая точка входа для всех file uploads
- AC2: Валидация type + size до сохранения в S3
- AC3: ~~Resize автоматический, без потери соотношения сторон~~ **[post-MVP — deferred]**
- AC4: ~~Signed URLs для защищённых файлов~~ public URLs для всего контента в MVP **[post-MVP: signed URLs]**
- AC5: ~~Cron cleanup orphaned файлов (daily)~~ **[post-MVP — deferred]**

**Реализация (из storage.service.ts):**
- S3 Client: @aws-sdk/client-s3, endpoint из env STORAGE_ENDPOINT
- Bucket: env STORAGE_BUCKET || 'chesstourism'
- Категории:
  - avatar: JPG/PNG/WebP, max 5MB, prefix "avatars"
  - tournament-photo: JPG/PNG/WebP, max 10MB, prefix "tournaments/photos"
  - document: PDF, max 20MB, prefix "documents"
- Key generation: {prefix}/{uuid}.{ext}
- URL: публичный {STORAGE_ENDPOINT}/{STORAGE_BUCKET}/{key}
- Graceful degradation: если storage не настроен (env отсутствуют) — возвращает placeholder URL "https://placeholder.storage/{key}"
- UploadValidationError — custom error class для 400 responses

**Точки вызова:**
- POST /api/profile/avatar — multer(memoryStorage, 20MB limit) → validateAndUpload('avatar')
- Tournament photos: описано в UC-09

---

## SYS-06: Chargeback/Dispute Handler

**Актор:** СИСТЕМА (Stripe → Backend → Admin)
**Цель:** Уведомить администратора о chargebacks и зафиксировать в системе

**Триггер:** `charge.dispute.created` webhook event (обработка в SYS-04)

**Основной поток:**
1. SYS-04 получает `charge.dispute.created`
2. Система находит payment по charge ID
3. Payment status → DISPUTED
4. Создаётся admin notification: "Chargeback received for payment {payment_id}, tournament {name}, amount {amount}"
5. In-app уведомление admin (notification type: PAYMENT_DISPUTED)
6. Event логируется в webhook_events

**Данные:**
- payment.status: добавить DISPUTED в enum [pending, completed, failed, refunded, disputed]
- notification: {admin_id, type: PAYMENT_DISPUTED, payload: {payment_id, charge_id, amount}}

**Acceptance criteria:**
- AC1: charge.dispute.created → payment.status = DISPUTED
- AC2: Admin получает in-app уведомление с деталями платежа
- AC3: Admin видит DISPUTED payments в /admin/finances
- AC4: Возврат средств — только через Stripe Dashboard (без автоматизации в v1)

**Реализация (из payments.ts — charge.dispute.created handler):**
- Resolve chain: charge_id → stripe.charges.retrieve → payment_intent → stripe.checkout.sessions.list → sessionId → prisma.payment.findFirst({externalId: sessionId})
- Transaction: payment.status → DISPUTED + webhookEvent create
- Admin notification: createNotification всем ADMIN пользователям, тип 'PAYMENT_DISPUTED', payload: {paymentId, disputeId, chargeId, amount, currency, reason}
- Idempotency: по stripeEventId
- Если payment не найден: log warning, записать webhookEvent (status='processed'), return 200

---

## UC-CLEANUP-01: Удаление orphan экранов

**Актор:** Разработчик (одноразовая задача)
**Цель:** Убрать мёртвый код из кодовой базы

**Действия:**
1. Удалить `/(onboarding)/_layout.tsx` и папку `(onboarding)/` — UC-19 cut, quiz экран никогда не создавался, группа пуста
2. ~~Добавить redirect `/ratings/history → /ratings`~~ — ОТМЕНЕНО: UC-26 reverted to KEEP (2026-04-06), экран реализован и доступен через кнопку на /ratings

**Acceptance criteria:**
- AC1: ~~`/ratings/history` возвращает redirect 301 на `/ratings`~~ — НЕ применяется (UC-26 keep)
- AC2: `/(onboarding)/` группа удалена из кодовой базы
- AC3: Нет broken links в приложении

---

## UC-NEW-12: Free Tournament Auto-Confirm

**Актор:** СИСТЕМА (trigger: commissioner approves participant OR participant self-registers)
**Цель:** Автоматически подтвердить участие в бесплатном турнире без Stripe flow

**Предусловие:** Турнир entry_fee = 0

**Основной поток:**
1. Комиссар добавляет участника (UC-07) ИЛИ участник саморегистрируется (UC-28)
2. Система проверяет: tournament.entry_fee = 0
3. Если 0 → registration.status = PAID (минуя PENDING/payment flow)
4. Email участнику: "Вы зарегистрированы на бесплатный турнир {name}"

**Альтернативные потоки:**
- A1: Турнир становится платным после регистрации → PAID статус сохраняется (grandfather clause)

> Note (Architect): Изменение fee разрешено в любое время. Существующие PAID регистрации сохраняют PAID статус. Новые регистрации проходят через актуальный flow (Stripe если fee>0, авто-PAID если fee=0).

**Acceptance criteria:**
- AC1: fee=0 → registration.status = PAID сразу (не PENDING)
- AC2: Confirmation email отправляется немедленно
- AC3: Участник виден комиссару как "Подтверждён (бесплатно)"
- AC4: Stripe flow НЕ вызывается для fee=0

**Реализация (из tournaments.ts — POST /api/tournaments/:id/register):**
- Проверка: `const isFree = (tournament.fee ?? 0) === 0;`
- Free path: $transaction → registration(status='PAID') + payment(amount=0, currency, status='PAID') + link registration.paymentId
- Fire-and-forget: sendThankYouEmail после commit
- Paid path: registration(status='PENDING'), без payment record до оплаты

**Реализация (из PUT /api/tournaments/:id/registrations/:regId — approve):**
- Commissioner approves: `const effectiveStatus = (status === 'APPROVED' && isFree) ? 'PAID' : status;`
- Free + APPROVED → auto-upgrade to PAID: $transaction создает Payment(amount=0, status=PAID) если нет

---

## UC-35: Admin Finances Dashboard

**Актор:** Администратор
**Страница:** /(admin)/finances
**Цель:** Просмотр выручки платформы, мониторинг платежей и возвратов

**Гость видит:** Редирект → /(auth)/login → / (только role=ADMIN)

**Основной поток:**
1. Admin переходит в /(admin)/finances
2. Видит 4 summary-карточки: Total Revenue / Paid Count / Pending / Refunds+Disputes
3. Выбирает период фильтрации: All Time / This Month / Last 30d / This Year
4. Видит paginated список транзакций: пользователь, турнир, сумма, статус, дата
5. Прокручивает вниз → Load More подгружает следующую страницу

**Acceptance criteria:**
- AC-01: Period filter обновляет summary-карточки И список транзакций одновременно
- AC-02: Список пагинируется через Load More (не infinite scroll)
- AC-03: Платежи со статусами FAILED и DISPUTED отображаются с корректными цветными badge
- AC-04: Revenue в карточке считает только PAID платежи (не PENDING/FAILED)

**Эндпоинты:** GET /api/admin/finances

**UI состояния:**
- **Loading:** Спиннеры на summary-карточках и таблице
- **Empty:** Нет транзакций -- карточки с нулями, таблица пуста
- **Error:** 403 если не ADMIN

**Данные в summary карточках:**
- Total Revenue: сумма amount где status=PAID
- Paid Count: количество PAID
- Pending: количество PENDING
- Refunds+Disputes: количество REFUNDED + DISPUTED

**Данные в таблице транзакций:**
- user: name/email
- tournament: title
- amount + currency
- status: badge (PAID green, PENDING yellow, FAILED red, DISPUTED red, REFUNDED gray)
- date: createdAt

---

## SCREEN INVENTORY

| # | Route | File | Component | UC Ref | Guest | Status |
|---|-------|------|-----------|--------|-------|--------|
| 1 | / | app/index.tsx | HomeScreen | UC-25 | public | OK |
| 2 | /(auth)/login | app/(auth)/login.tsx | LoginScreen | UC-00, UC-NEW-06 | public | OK |
| 3 | /(auth)/otp | app/(auth)/otp.tsx | OtpScreen | UC-00 | public | OK |
| 4 | /tournaments | app/tournaments/index.tsx | TournamentsListScreen | UC-27 | public | OK |
| 5 | /tournaments/:id | app/tournaments/[id].tsx | TournamentDetailScreen | UC-24 | public | OK |
| 6 | /commissars | app/commissars/index.tsx | CommissarsScreen | UC-29 | public | OK |
| 7 | /commissars/:id | app/commissars/[id].tsx | CommissionerPublicProfileScreen | UC-14 | public | OK |
| 8 | /users/:id | app/users/[id].tsx | PublicProfileScreen | UC-33 | public | OK |
| 9 | /ratings | app/ratings/index.tsx | RatingsScreen | UC-17 | public | OK |
| 10 | /ratings/history | app/ratings/history.tsx | RatingHistoryScreen | UC-26 | public | OK |
| 11 | /organizations/apply | app/organizations/apply.tsx | OrganizationApplyScreen | UC-15 | public | OK |
| 12 | /verify/:id | app/verify/[id].tsx | VerifyCertificateScreen | UC-05 | public | OK |
| 13 | /payment-success | app/payment-success.tsx | PaymentSuccessScreen | UC-10 | public | OK |
| 14 | /notifications | app/notifications/index.tsx | NotificationsScreen | UC-21 | auth_required | OK |
| 15 | /(dashboard) | app/(dashboard)/index.tsx | DashboardScreen | UC-04 | auth_required | OK |
| 16 | /(dashboard)/profile | app/(dashboard)/profile/index.tsx | ProfileEditorScreen | UC-01, UC-22 | auth_required | OK |
| 17 | /(dashboard)/my-registrations | app/(dashboard)/my-registrations/index.tsx | MyRegistrationsScreen | UC-32 | auth_required | OK |
| 18 | /(dashboard)/watchlist | app/(dashboard)/watchlist/index.tsx | WatchlistScreen | UC-20 | auth_required | OK |
| 19 | /(dashboard)/tournaments/create | app/(dashboard)/tournaments/create.tsx | CreateTournamentScreen | UC-06 | auth_required | OK |
| 20 | /(dashboard)/tournaments/manage | app/(dashboard)/tournaments/manage.tsx | ManageTournamentScreen | UC-31 | auth_required | OK |
| 21 | /(dashboard)/tournaments/:id/edit | app/(dashboard)/tournaments/[id]/edit.tsx | EditTournamentScreen | UC-06, UC-NEW-05 | auth_required | OK |
| 22 | /(dashboard)/tournaments/:id/registrations | app/(dashboard)/tournaments/[id]/registrations.tsx | RegistrationsScreen | UC-07, UC-11 | auth_required | OK |
| 23 | /(dashboard)/tournaments/:id/results | app/(dashboard)/tournaments/[id]/results.tsx | ResultsScreen | UC-23 | auth_required | OK |
| 24 | /(dashboard)/tournaments/:id/photos | app/(dashboard)/tournaments/[id]/photos.tsx | TournamentPhotosScreen | UC-09 | auth_required | OK |
| 25 | /(dashboard)/commissioner | app/(dashboard)/commissioner/index.tsx | CommissionerCabinetScreen | UC-02, UC-NEW-07 | auth_required | OK |
| 26 | /(dashboard)/commissioner/edit | app/(dashboard)/commissioner/edit.tsx | CommissionerEditScreen | UC-NEW-07 | auth_required | OK |
| 27 | /(dashboard)/payment/:tournamentId | app/(dashboard)/payment/[tournamentId].tsx | PaymentScreen | UC-34 | auth_required | OK |
| 28 | /(admin) | app/(admin)/index.tsx | AdminDashboardScreen | UC-30 | auth_required | OK |
| 29 | /(admin)/moderation | app/(admin)/moderation/index.tsx | AdminModerationScreen | UC-16 | auth_required | OK |
| 30 | /(admin)/users | app/(admin)/users/index.tsx | AdminUsersScreen | UC-30 | auth_required | OK |
| 31 | /(admin)/tournaments | app/(admin)/tournaments/index.tsx | AdminTournamentsScreen | UC-30 | auth_required | OK |
| 32 | /(admin)/organizations | app/(admin)/organizations/index.tsx | AdminOrgsScreen | UC-16 | auth_required | OK |
| 33 | /(admin)/finances | app/(admin)/finances/index.tsx | AdminFinancesScreen | UC-35 | auth_required | OK |

### MISSING screens (UC есть, экрана нет — планируется)
- UC-NEW-09: `/(commissioner)/[id]/rounds` — управление раундами турнира
- UC-NEW-10: `/tournaments/:id/schedule` — публичное расписание
- UC-NEW-11: `/tournaments/:id/announcements` — лента объявлений

### Статистика
- **Всего экранов:** 33
- **Покрыто UC:** 33 (100%)
- **ORPHAN (нет UC):** 0
- **MISSING (UC без кода):** 3 (UC-NEW-09, UC-NEW-10, UC-NEW-11)
- **Dead:** 0
