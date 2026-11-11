# Security Specification: Sistem Manajemen Wali Kelas Profesional

## 1. Data Invariants
- **Multi-Tenant Homeroom Teacher Isolation:** Every classroom, student record, attendance entry, academic score, character observation, discipline record, achievement, communication log, report, and welfare case must have a `teacherId` strictly matching `request.auth.uid`.
- **Identity Integrity:** Authenticated users (`request.auth.uid != null`) can only create, read, update, and delete records where `resource.data.teacherId == request.auth.uid` or `incoming().teacherId == request.auth.uid`.
- **Immutability of Audit Fields:** The `createdAt` and `teacherId` fields are strictly immutable once created.
- **Strict Key Schema Validation:** Payloads must provide required keys and forbid unauthorized ghost fields to prevent shadow escalation.
- **PII Protection:** Student personal data (addresses, phone numbers, parent jobs, health history) must never be accessible without authentication or by another teacher.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Identity Spoofing on Student Creation:** Payload with `teacherId: "victim_teacher_456"` sent by `attacker_123`. Must return `PERMISSION_DENIED`.
2. **Ghost Field Escalation:** Adding `role: "admin"` or `verified: true` into student payload. Must return `PERMISSION_DENIED`.
3. **Path Variable ID Poisoning:** Document ID consisting of 2000 invalid characters. Must return `PERMISSION_DENIED`.
4. **Cross-Tenant List Scraping:** Attacker querying `/students` without `where('teacherId', '==', request.auth.uid)`. Must return `PERMISSION_DENIED`.
5. **Immutable Field Mutation:** Updating `createdAt` or `teacherId` in an existing student or grade document. Must return `PERMISSION_DENIED`.
6. **Invalid Enum in Attendance:** Attempting to store `status: "BolosParah"` or non-standard status. Must return `PERMISSION_DENIED`.
7. **Score Value Out of Bounds:** Submitting an academic score of `150` or `-20`. Must return `PERMISSION_DENIED`.
8. **Rating Value Poisoning:** Submitting character rating of `99` instead of 1-5. Must return `PERMISSION_DENIED`.
9. **Unauthenticated Read of Student PII:** Guest attempting to `get` `/students/{studentId}`. Must return `PERMISSION_DENIED`.
10. **Unauthenticated List on Welfare Cases:** Guest attempting to read sensitive welfare and counseling logs. Must return `PERMISSION_DENIED`.
11. **Denial-of-Wallet Payload:** Sending 1.5MB character strings in `specialNotes` or `notes`. Must return `PERMISSION_DENIED`.
12. **Unauthorized Deletion:** Teacher B attempting to delete Teacher A's class or student. Must return `PERMISSION_DENIED`.

## 3. Test Invariant Runner
All security test suites assert that operations violating these invariants fail with `PERMISSION_DENIED`.
