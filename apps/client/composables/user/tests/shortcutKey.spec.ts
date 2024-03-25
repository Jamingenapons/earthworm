import { beforeEach, describe, expect, it } from "vitest";
import {
  DEFAULT_SHORTCUT_KEYS,
  SHORTCUT_KEYS,
  SHORTCUT_KEY_TYPES,
  useShortcutKeyMode,
} from "~/composables/user/shortcutKey";

describe("user defined shortcut key", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe("shortcut key data", () => {
    it("should be the default shortcut key data if localStorage no cache", () => {
      const { shortcutKeys } = useShortcutKeyMode();

      expect(shortcutKeys.value).toEqual(DEFAULT_SHORTCUT_KEYS);
    });

    it("should be equal to cache data if localStorage has cache", () => {
      const storeShortcutKeys = {
        sound: "Ctrl+s",
        previous: "Ctrl+,",
        answer: "Ctrl+8",
        skip: "Ctrl+.",
      };

      localStorage.setItem(SHORTCUT_KEYS, JSON.stringify(storeShortcutKeys));
      const { shortcutKeys } = useShortcutKeyMode();

      expect(shortcutKeys.value).toEqual(storeShortcutKeys);
    });
  });

  describe("shortcut dialog", () => {
    it("should be true when edit shortcut key", () => {
      const { showModal, handleEdit } = useShortcutKeyMode();

      handleEdit(SHORTCUT_KEY_TYPES.SOUND);

      expect(showModal.value).toBeTruthy();
    });

    it("should be close the dialog when press Enter key", () => {
      const { showModal, handleEdit, handleKeydown } = useShortcutKeyMode();

      handleEdit(SHORTCUT_KEY_TYPES.SOUND);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(showModal.value).toBeFalsy();
    });
  });

  describe("shortcut key set", () => {
    it("should be the shortcut key set invalid when the dialog is not open", () => {
      const { showModal, shortcutKeyStr, handleKeydown } = useShortcutKeyMode();

      // Ctrl+s
      handleKeydown({
        key: "s",
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(shortcutKeyStr.value).toBe("");
    });

    it("should be the shortcut key is changed when the dialog is open", () => {
      const {
        showModal,
        shortcutKeyStr,
        shortcutKeyTip,
        handleEdit,
        handleKeydown,
      } = useShortcutKeyMode();

      handleEdit(SHORTCUT_KEY_TYPES.SOUND); // open dialog

      handleKeydown({
        key: "s",
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(shortcutKeyStr.value).toEqual("Ctrl+s");
      expect(shortcutKeyTip.value).toEqual("Ctrl 加上 s");
    });

    it("should be the shortcut key is set successfully when the dialog is open (single key)", () => {
      const { showModal, shortcutKeys, handleEdit, handleKeydown } =
        useShortcutKeyMode();

      handleEdit(SHORTCUT_KEY_TYPES.SOUND);

      handleKeydown({
        key: "Tab",
        preventDefault: () => {},
      } as KeyboardEvent);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(shortcutKeys.value).toMatchObject({
        [SHORTCUT_KEY_TYPES.SOUND]: "Tab",
      });
    });

    it("should be the shortcut key is set successfully when the dialog is open (combination key)", () => {
      const { showModal, shortcutKeys, handleEdit, handleKeydown } =
        useShortcutKeyMode();

      handleEdit(SHORTCUT_KEY_TYPES.ANSWER);

      handleKeydown({
        key: "s",
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);

      expect(shortcutKeys.value).toMatchObject({
        [SHORTCUT_KEY_TYPES.ANSWER]: "Ctrl+s",
      });
    });
    it("should be not set successfully with the same shortcut", () => {
      const { showModal, shortcutKeys, handleEdit, handleKeydown, hasSameShortcutKey } =
        useShortcutKeyMode();

      handleEdit(answerKey);

      expect(showModal.value).toBeTruthy();

      handleKeydown({
        key: "s",
        metaKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);
      expect(hasSameShortcutKey.value).toBeFalsy()
      expect(showModal.value).toBeFalsy();
      expect(shortcutKeys.value).toMatchObject({ [answerKey]: "Command+s" });

      handleEdit(soundKey);

      expect(showModal.value).toBeTruthy();

      handleKeydown({
        key: "s",
        metaKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);
      
      expect(hasSameShortcutKey.value).toBeTruthy()
      expect(showModal.value).toBeTruthy();
      expect(shortcutKeys.value).toMatchObject({ [answerKey]: "Command+s", [soundKey]: "Ctrl+'" });
    })
    it("should be the shortcut key is set successfully with the same key", () => {
      const { showModal, shortcutKeys, handleEdit, handleKeydown, hasSameShortcutKey } =
      useShortcutKeyMode();

      handleEdit(answerKey);

      expect(showModal.value).toBeTruthy();
      handleKeydown({
        key: ";",
        ctrlKey: true,
        preventDefault: () => {},
      } as KeyboardEvent);
      handleKeydown({
        key: "Enter",
        preventDefault: () => {},
      } as KeyboardEvent);
      expect(hasSameShortcutKey.value).toBeFalsy()
      expect(showModal.value).toBeFalsy();
      expect(shortcutKeys.value).toMatchObject({ [answerKey]: "Ctrl+;" });
    })
  });
});
