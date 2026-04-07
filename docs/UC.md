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
1. Удалить `/(onboarding)/quiz.tsx` — UC-19 cut, экран не используется
2. Добавить redirect `/ratings/history → /ratings` — UC-26 cut
3. Обновить навигационные ссылки если есть ссылки на эти маршруты

**Acceptance criteria:**
- AC1: `/ratings/history` возвращает redirect 301 на `/ratings`
- AC2: `/(onboarding)/quiz` не достижим через навигацию
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
