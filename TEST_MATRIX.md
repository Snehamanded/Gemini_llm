# Test Matrix - AutoSherpa WhatsApp Bot

## Test Coverage Matrix

| Test ID | Category | Scenario | Input | Expected Output | Status | Notes |
|---------|----------|----------|-------|-----------------|--------|-------|
| **GREETING & RESET** |
| T001 | Greeting | Basic greeting | "Hi" | "Hello! Welcome to Sherpa Hyundai! How can I help you today?" | ✅ | |
| T002 | Greeting | Alternative greeting | "Hello" | Welcome message | ✅ | |
| T003 | Reset | Reset conversation | "restart" | Welcome message + cleared state | ✅ | |
| **OUT OF CONTEXT** |
| T004 | Out of Context | Non-car query | "I'm hungry" | Redirect to car services | ✅ | |
| T005 | Out of Context | Food query | "i want idly" | Redirect to car services | ✅ | |
| T006 | Timings | Shop hours query | "What are your shop time" | Showroom timings | ✅ | |
| T007 | Location | Address query | "where are you located" | Showroom locations | ✅ | |
| **BROWSE USED CARS** |
| T008 | Browse | Start browse | "browse used cars" | Ask for budget | ✅ | |
| T009 | Browse | Budget first | "under 10 lakhs" | Ask for body type | ✅ | |
| T010 | Browse | Type selection | "SUV" | Ask for brand | ✅ | |
| T011 | Browse | Brand selection | "Hyundai" | Show car list | ✅ | |
| T012 | Browse | Pagination | "show more" | Show next 5 cars | ✅ | |
| T013 | Browse | Car selection | "car1" | Show car details + test drive option | ✅ | |
| T014 | Browse | Full flow EN | "SUV under 12 lakhs, Hyundai" | Show filtered results | ✅ | |
| T015 | Browse | Hinglish flow | "second hand car dekhna hai" | Budget prompt | ✅ | |
| T016 | Browse | Budget parsing | "8 lakh tak" | ₹8,00,000 confirmed | ✅ | |
| T017 | Browse | Type parsing | "SUV chahiye" | Type confirmed | ✅ | |
| **CAR FEATURES** |
| T018 | Features | After selection | "features" (after car1) | Show car specs | ✅ | |
| T019 | Features | Explicit query | "features of Honda City VX" | Show specs | ✅ | |
| **COMPARISON** |
| T020 | Compare | Direct compare | "Honda City vs Toyota Camry" | Show comparison | ✅ | |
| T021 | Compare | After selection | "compare with Toyota Camry" | Show comparison | ✅ | |
| T022 | Compare | Typo handling | "Hundai Cretaa vs KIA Seltis" | Auto-correct & compare | ✅ | |
| **TEST DRIVE** |
| T023 | Test Drive | Inline car name | "Can I test drive Tata Nexon" | Date options | ✅ | |
| T024 | Test Drive | Generic start | "I want a test drive" | Ask for car name | ✅ | |
| T025 | Test Drive | Car name entry | "Tata Nexon" | Date options | ✅ | |
| T026 | Test Drive | Weekend date | "this weekend" | Time slots | ✅ | |
| T027 | Test Drive | Tomorrow date | "tomorrow" | Time slots | ✅ | |
| T028 | Test Drive | Time parsing | "12pm" | Location selection | ✅ | |
| T029 | Test Drive | Time parsing | "3pm" | Location selection | ✅ | |
| T030 | Test Drive | Location selection | "Main Showroom" | Contact details prompt | ✅ | |
| T031 | Test Drive | Contact details | "Name: Rahul, Phone: 9876543210" | Booking confirmation | ✅ | |
| T032 | Test Drive | Cancel booking | "cancel test drive" + phone | Cancellation confirmation | ✅ | |
| T033 | Test Drive | Check booking | "test drive status" + ID | Show booking details | ✅ | |
| **CAR VALUATION** |
| T034 | Valuation | Start valuation | "car valuation" | Ask for details | ✅ | |
| T035 | Valuation | Multi-turn | "Hyundai i20 2019" then "70000 km good condition" | Estimate range | ✅ | |
| **SERVICE BOOKING** |
| T036 | Service | Start service | "book a service" | Ask for vehicle details | ✅ | |
| T037 | Service | Accident repair | "My car needs accident repair" | Ask for make/model | ✅ | |
| T038 | Service | One-shot parse | "Hyundai i20 2020 KA01AB1234, Regular Service" | Confirmation | ✅ | |
| **FINANCING/EMI** |
| T039 | Financing | EMI query | "What EMI for a car around 10 lakhs?" | Show EMI breakdown | ✅ | |
| T040 | Financing | With car mention | "I'm interested in financing options for Hyundai Creta" | Ask for price | ✅ | |
| T041 | Financing | Follow-up | "15 lakhs" then "What's the EMI for 5 years?" | Show EMI for 5yr term | ✅ | |
| **ABOUT US** |
| T042 | About | About menu | "about" | Show about options | ✅ | |
| T043 | About | Escape from about | "browse used cars" (while in about) | Start browse flow | ✅ | |
| **CONTACT** |
| T044 | Contact | Contact menu | "contact" | Show contact options | ✅ | |
| T045 | Contact | Call now | "1" or "call us now" | Show phone numbers | ✅ | |
| **HINGLISH SUPPORT** |
| T046 | Hinglish | Browse | "second hand car dekhna hai" | Hinglish response | ✅ | |
| T047 | Hinglish | Budget | "budget 8 lakh tak" | Hinglish confirmation | ✅ | |
| T048 | Hinglish | Type | "SUV chahiye" | Hinglish response | ✅ | |
| **ERROR HANDLING** |
| T049 | Error | Invalid car name | "xyz car" (not in DB) | "Couldn't find" message | ✅ | |
| T050 | Error | Invalid date | "yesterday" for test drive | Ask for valid date | ✅ | |
| **EDGE CASES** |
| T051 | Edge | Empty input | "" | No crash | ✅ | |
| T052 | Edge | Special chars | "car@#$" | Handled gracefully | ✅ | |
| T053 | Edge | Very long input | 500+ chars | Handled gracefully | ✅ | |
| T054 | Edge | Multiple intents | "browse and test drive" | Handle first intent | ✅ | |

## Test Execution Commands

```bash
# Run all scenario tests
npm run test:scenarios

# Test DB connection
npm run test:db

# Test brand coverage
npm run test:brands
```

## Test Scenarios by Flow

### Browse Flow Test Sequence
1. "browse used cars" → Budget prompt
2. "under 10 lakhs" → Type prompt
3. "SUV" → Brand prompt
4. "Hyundai" → Car list
5. "show more" → Next 5 cars
6. "car1" → Car details
7. "features" → Full specs
8. "yes" (test drive) → Test drive flow

### Test Drive Flow Test Sequence
1. "Can I test drive Tata Nexon" → Date options
2. "this weekend" → Time slots
3. "12pm" → Location selection
4. "Main Showroom" → Contact prompt
5. "Name: John, Phone: 9876543210, Email: john@example.com" → Booking confirmation

### Service Booking Test Sequence
1. "book a service" → Details prompt
2. "Hyundai i20 2020 KA01AB1234, Regular Service, Tomorrow 11am" → Confirmation

### Comparison Test Sequence
1. "Honda City vs Toyota Camry" → Comparison table
2. "compare with Toyota Camry" (after selecting car) → Comparison

## Regression Test Checklist

Before each release, verify:
- [ ] Greeting reset works
- [ ] Out-of-context queries redirect properly
- [ ] Browse flow completes end-to-end
- [ ] Test drive booking completes end-to-end
- [ ] Car selection (car1, car2, etc.) works
- [ ] Features query works
- [ ] Comparison works
- [ ] EMI calculation works
- [ ] Session state persists correctly
- [ ] No infinite loops in conversations
- [ ] Hinglish detection works
- [ ] Error handling is graceful

## Known Issues

1. **Browse Flow**: If user says "SUV" before budget, it asks for budget repeatedly
   - Fix: Extract type from first message and store, proceed to budget

2. **Valuation**: Multi-turn parsing needs improvement
   - Fix: Better regex for extracting make/model/year/km/condition from natural language

3. **Service Booking**: One-shot parsing needs enhancement
   - Fix: Better NLP extraction for all fields in one message

4. **EMI Follow-up**: Doesn't remember previous price mentioned
   - Fix: Store price in session when mentioned, reuse in follow-up queries

## Performance Benchmarks

- Response time: < 2 seconds (deterministic flows)
- DB query time: < 500ms
- Session lookup: < 10ms

## Test Environment

- Node.js: v20.19.5
- Database: PostgreSQL (Neon)
- WhatsApp API: Meta Graph API v20.0

