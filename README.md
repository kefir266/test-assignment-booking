## Description

Test assigment

## Project setup

```bash
$ yarn install
```

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

---

# Original description:

## Тестове завдання: API для зіставлення бронювань та страхових кейсів

Реалізуйте NestJS API з одним ендпоінтом `POST /match`, який приймає два списки:

- `bookings`: список бронювань
- `claims`: список страхових випадків

API повинно здійснювати метчинг (зіставлення) кожного бронювання з найбільш відповідним кейсом згідно з наступними критеріями:

#### Обов'язкові критерії (без них матч неможливий):

1. `patient` — Ідентифікатор пацієнта має збігатись.
2. `bookingDate` в claim і `reservationDate` в booking — дата (не час) має бути однакова.

#### Додаткові критерії для підвищення точності матчу:

1. Співпадіння `test` і `medicalServiceCode` (через `testsMap`)
2. Співпадіння **точного часу** бронювання (години та хвилини на базі reservationDate та bookingDate)
3. Співпадіння страхової компанії (`insurance`)

У випаку коли є метч, але не всі поля співпадають - потрібно в обєкті метчу додати поле mistmatch - в якому прописати ті поля які не співпали.

Основна суть цього метчингу в тому - щоб допомогти медичним закладам знаходити розбіжності в двох системах(системі бронювання та страховій системі).

Наприклад бувають випадки що в системі бронювання та страховій системі - зазначений різний час відвідування.
**Важливо: метч може бути тільки 1 до 1. Якщо є декілька метчів потрібно обрати той який має найбільше співпадінь.**

Приклад обєктів:

#### Бронювання(booking):

```
{ "id": "booking_1", "patient": "patient_1", "test": "test_1", //id тесту(bookingTestId) "insurance": "AON", //назва страхової компанії "reservationDate": "2025-05-16T11:00:00.000Z", //дата та час бронювання }
```

#### Страховий випадок(claim):

```
{ "id": "claim_1", "medicalServiceCode": "medical_service_1",//id тесту в страховій системі(claimTestId) "bookingDate": "2025-05-15T10:33:00.000Z", //дата та час бронювання "insurance": "AON",//назва страхової компанії "patient": "patient_1", }
```

#### Мап тестів(test map):

Використовується для того щоб співставити тести в системі бронювання та страховій системі.

```
[ { "bookingTestId": "test_1", "claimTestId": "medical_service_1" }, { "bookingTestId": "test_2", "claimTestId": "medical_service_2" } ]
```

### Тестові данні:

#### Bookings:

```
[ { "id": "booking_1", "patient": "patient_1", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-16T11:00:00.000Z" }, { "id": "booking_2", "patient": "patient_2", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-15T11:30:00.000Z" }, { "id": "booking_3", "patient": "patient_3", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-15T11:30:00.000Z" }, { "id": "booking_4", "patient": "patient_4", "test": "test_1", "insurance": "FASCHIM", "reservationDate": "2025-05-15T10:30:00.000Z" }, { "id": "booking_5", "patient": "patient_5", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-15T10:25:00.000Z" }, { "id": "booking_6", "patient": "patient_6", "test": "test_1", "insurance": "FASCHIM", "reservationDate": "2025-05-15T10:31:00.000Z" }, { "id": "booking_7", "patient": "patient_7", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-15T10:30:00.000Z" }, { "id": "booking_8", "patient": "patient_7", "test": "test_1", "insurance": "FASCHIM", "reservationDate": "2025-05-15T10:31:00.000Z" }, { "id": "booking_9", "patient": "patient_8", "test": "test_1", "insurance": "FASCHIM", "reservationDate": "2025-05-15T10:30:00.000Z" } ]
```

#### Claims:

```
[ { "id": "claim_1", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T10:33:00.000Z", "insurance": "AON", "patient": "patient_1" }, { "id": "claim_2", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T11:30:00.000Z", "insurance": "AON", "patient": "patient_2" }, { "id": "claim_3", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T00:00:00.000Z", "insurance": "AON", "patient": "patient_3" }, { "id": "claim_4", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T10:30:00.000Z", "insurance": "AON", "patient": "patient_4" }, { "id": "claim_5", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T10:25:00.000Z", "insurance": "AON", "patient": "patient_5" }, { "id": "claim_6", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T10:25:00.000Z", "insurance": "AON", "patient": "patient_6" }, { "id": "claim_7", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T10:30:00.000Z", "insurance": "AON", "patient": "patient_7" }, { "id": "claim_8", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T00:00:00.000Z", "insurance": "AON", "patient": "patient_7" }, { "id": "claim_9", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T10:31:00.000Z", "insurance": "AON", "patient": "patient_8" }, { "id": "claim_10", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T00:00:00.000Z", "insurance": "FASCHIM", "patient": "patient_8" } ]
```

#### Tests:

```
[ { "bookingTestId": "test_1", "claimTestId": "medical_service_1" }, { "bookingTestId": "test_2", "claimTestId": "medical_service_2" } ]
```

### Приклад використання:

`POST /match`

### Body:

```
{ "bookings": [ { "id": "booking_1", "patient": "patient_1", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-16T11:00:00.000Z" }, { "id": "booking_7", "patient": "patient_7", "test": "test_1", "insurance": "AON", "reservationDate": "2025-05-15T10:30:00.000Z" }, { "id": "booking_9", "patient": "patient_8", "test": "test_1", "insurance": "FASCHIM", "reservationDate": "2025-05-15T10:30:00.000Z" } ], "claims": [ { "id": "claim_1", "medicalServiceCode": "medical_service_1", "bookingDate": "2025-05-15T10:33:00.000Z", "insurance": "AON", "patient": "patient_1" }, { "id": "claim_9", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T10:31:00.000Z", "insurance": "AON", "patient": "patient_8" }, { "id": "claim_10", "medicalServiceCode": "medical_service_2", "bookingDate": "2025-05-15T00:00:00.000Z", "insurance": "FASCHIM", "patient": "patient_8" } ] }
```

#### Response:

```
[ { "claim": "claim_10", "booking": "booking_9", "mismatch": [ "time", "test" ] } ]
```
