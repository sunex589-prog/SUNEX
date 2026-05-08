# Security Specification for SUNEX

## 1. Data Invariants
- A `Pedido` must have a unique ID matching the path.
- `createdAt` is immutable and must be the server time.
- `status` must follow a valid state transition (though rules will loosely enforce values, updates are restricted by role).
- Customers can only update `comprovanteUrl` and `status` to `pagamento_enviado`.
- Only admins can read all orders or delete orders.
- `mail` collection is for system notifications, only admins (who trigger status changes) can write to it.

## 2. The "Dirty Dozen" Payloads (Attacker Payloads)

1. **Identity Spoofing**: Creating a pedido with someone else's ID in the payload.
2. **Ghost Field Injection**: Adding `isVerified: true` to a pedido create request.
3. **State Shortcutting**: Updating a new pedido directly to `finalizado`.
4. **Denial of Wallet**: Sending a document ID that is 1MB in size.
5. **Unauthorized Listing**: Authenticated non-admin user trying to list all `pedidos`.
6. **Admin Escalation**: Trying to create an `admins` document for oneself.
7. **PII Leak**: Non-admin user trying to `get` another user's pedido without knowing the ID (though `get` is allowed if ID is known, `list` is restricted). Wait, `get` should be protected? The tracker uses `id`. If I know the ID, I can see the order. That's by design. But `list` must be admin-only.
8. **Malicious Mail**: User trying to write to the `mail` collection to spam.
9. **Timestamp Spoofing**: Setting `createdAt` to a date in the past.
10. **Shadow Update**: Updating `nome` of an existing pedido as a customer.
11. **ID Poisoning**: Using special characters or junk in the document ID.
12. **Status Poisoning**: Updating `status` to a non-enum value.

## 3. The Test Runner Plan
I'll create `firestore.rules.test.ts` (conceptual for now, focusing on the rules implementation).

