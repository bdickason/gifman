# 🚀 Development Workflow (Rufus + Helper)

This project uses a **helper-driven development loop** with Rufus.

The agent does NOT run shell commands directly. Instead, it uses structured signals that the Rufus system interprets.

---

## 🧠 Core Model

There are three layers:

| Layer | Responsibility |
|------|----------------|
| Rufus (agent) | Writes code, reasons about failures |
| Helper (system) | Executes commands safely |
| Tests | Define correctness |

---

## 🧪 Running Tests

### ❗ Important

Rufus CANNOT run shell commands like:

```

npm run test:run

```

Instead, Rufus must use:

```

RUN_TESTS

```

---

### 🔁 Test Execution Flow

1. Rufus writes code
2. Rufus outputs:

```

RUN_TESTS

```

3. Helper runs:

```

npm run test:rufus

```

4. Helper returns:

```

TEST RESULTS:
{
"status": "pass" | "fail",
"failures": [...],
"meta": {
"attempt": number,
"max_attempts": number,
"iteration_limit_reached": boolean
}
}

```

5. Rufus:
- analyzes results
- fixes issues
- repeats if needed

---

## 🧠 Agent Behavior Expectations

Rufus must:

- NEVER attempt to run npm, bash, or shell commands
- ONLY use `RUN_TESTS` to trigger tests
- WAIT for TEST RESULTS before continuing
- Use test failures to guide fixes
- Avoid repeating the same fix across attempts

---

## 🔁 Iteration Limits

- Test runs are capped (typically 3 attempts)
- If `iteration_limit_reached` is true:
  - stop retrying
  - reconsider approach

---

## 👤 Human vs Agent Roles

### Human (you)

- Can run:
  - `npm run test:run`
  - `npm run dev`
- Debug environment issues
- Review outputs

---

### Rufus (agent)

- Writes and modifies code
- Uses `RUN_TESTS`
- Responds to structured results
- Does NOT execute commands directly

---

## 🧭 Development Philosophy

- Prefer minimal changes over large refactors
- Work within the existing system
- Use tests as the source of truth
- Avoid introducing new infrastructure unless required

---

## ⚠️ Common Mistake

❌ Incorrect:
> “Run npm run test:run”

✅ Correct:
```

RUN_TESTS

```

---

## 🎯 Success Loop

```

write → RUN_TESTS → TEST RESULTS → fix → repeat

```

---

This system enables a **controlled autonomous development loop** where Rufus can safely iterate without direct shell access.
```
