# Optional Profile: React Native + Expo

This profile specializes the generic protocol for mobile apps built with React Native and Expo (including EAS Build/Update). It is guidance, not a mandatory core dependency.

## Typical verification mapping

Use the repository's actual scripts. Common layers may include:
- ESLint and a formatter;
- `tsc --noEmit` type checking;
- unit/component tests (Jest + React Native Testing Library);
- `expo-doctor` / dependency compatibility checks after SDK or native dependency changes;
- a development or preview build on real devices/simulators for both platforms;
- E2E (Maestro, Detox, or equivalent) for critical journeys;
- internal distribution (TestFlight/internal track) validation before store release.

Never invent script names or disable checks when adopting this profile.

## Release model risk

Mobile releases are not instantly reversible like web deploys:
- A store build cannot be recalled from devices that installed it. Treat release of native changes as at least R2.
- Over-the-air updates (EAS Update) can only ship JavaScript/assets compatible with the installed native runtime. Verify `runtimeVersion` policy before publishing; a mismatched update can crash on launch.
- Keep the backend backwards compatible with older app versions still in use. API changes need a compatibility window or a forced-update strategy.
- Define a rollback path for OTA updates (republish previous update) before publishing.

## Security

- Never ship secrets in the bundle: anything in app config or `EXPO_PUBLIC_*` variables is readable by users. Authorization belongs on the server.
- Store tokens in secure storage (Keychain/Keystore via `expo-secure-store`), not plain AsyncStorage.
- Validate deep links and universal links: treat parameters as untrusted input and never perform side effects without confirmation and auth.
- Audit new permissions (camera, location, contacts) for necessity; they affect store review and user trust.

## UX and platform behavior

Audit on both iOS and Android, including:
- small screens, notches/safe areas, and keyboard overlap on forms;
- dynamic type / font scaling and screen reader labels (`accessibilityLabel`, roles);
- touch target size;
- offline and flaky-network states for critical flows, including retry after uncertain completion;
- app backgrounding mid-operation and resuming;
- hardware back button on Android.

## Performance

- Long lists: use virtualized lists with stable keys; measure on a low-end Android device, not only a simulator.
- Avoid heavy work on the JS thread during navigation and animations.
- Track bundle and asset size growth for OTA updates.

## Observability progression

Start with crash reporting that includes app version, runtime version, and platform — without personal data. Add performance monitoring and release health tracking when the user base justifies it.
