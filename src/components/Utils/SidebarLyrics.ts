import Whentil, { type CancelableTask } from "@spikerko/tools/Whentil";
import storage from "../../utils/storage.ts";

import PageView from "../Pages/PageView.ts";

// Query selector functions
const getTranquilSidebarActiveBody = () => document.body;
// const getRootRightSidebar = () => document.querySelector<HTMLElement>('.Root__right-sidebar');
const getNowPlayingViewElement = () =>
  document.querySelector<HTMLElement>(".Root__right-sidebar aside.NowPlayingView");
const getDesktopPanelContainer = () =>
  document.querySelector<HTMLElement>(
    `.Root__right-sidebar aside#Desktop_PanelContainer_Id:has(.main-nowPlayingView-coverArtContainer)`
  );
const getRightSidebarParentContainer = () =>
  document.querySelector<HTMLElement>(".Root__right-sidebar > div:first-of-type") ??
  document.querySelector<HTMLElement>(".Root__right-sidebar .XOawmCGZcQx4cesyNfVO") ??
  document.querySelector<HTMLElement>(".Root__right-sidebar .oXO9_yYs6JyOwkBn8E4a");
const getQueueContainerElement = () =>
  document.querySelector<HTMLElement>(
    ".Root__right-sidebar > div:first-of-type:has(.v5CVyjR4gInbbJpm, .RSJZvcFNF4XzkvK4S1F9)"
  ) ??
  document.querySelector<HTMLElement>(
    ".Root__right-sidebar .XOawmCGZcQx4cesyNfVO:not(:has(.h0XG5HZ9x0lYV7JNwhoA.JHlPg4iOkqbXmXjXwVdo)):has(.jD_TVjbjclUwewP7P9e8)"
  ) ??
  document.querySelector<HTMLElement>(
    ".Root__right-sidebar .oXO9_yYs6JyOwkBn8E4a:not(:has(.Ot1yAtVbjD2owYqmw6BK)):has(.ZWs_BNtabE4F1v34pU93.mpdgC9UTkN5_fMm1pFiz)"
  ) ??
  document.querySelector<HTMLElement>(
    ".Root__right-sidebar .oXO9_yYs6JyOwkBn8E4a:not(:has(.Ot1yAtVbjD2owYqmw6BK)):has(.main-nowPlayingView-mainContainer.main-actionBar-ActionBarContainer)"
  );
const getDevicesContainerElement = () =>
  document.querySelector<HTMLElement>(
    ".Root__right-sidebar > div:first-of-type:has(.OINH5zA0pQyzffwo, .FNi2RAtuzIc9THq8HYIW):not(:has(.main-nowPlayingView-coverArtContainer))"
  );
// const getTranquilLyricsPageElement = () => document.querySelector<HTMLElement>('#TranquilLyricsPage');
const getParentContainerChildren = (parentContainer: HTMLElement) =>
  parentContainer.querySelector<HTMLElement>(":scope > *:not(#TranquilLyricsPage)");

export const getNowPlayingViewPlaybarButton = () => {
  // console.log("[Tranquil Lyrics Debug] getNowPlayingViewPlaybarButton");
  return document.querySelector<HTMLElement>('[data-testid="control-button-npv"]');
};
export const getNowPlayingViewContainer = () => {
  // console.log("[Tranquil Lyrics Debug] getNowPlayingViewContainer");
  return getNowPlayingViewElement() ?? getDesktopPanelContainer();
};
export const getNowPlayingViewParentContainer = () => {
  // console.log("[Tranquil Lyrics Debug] getNowPlayingViewParentContainer");
  return getRightSidebarParentContainer();
};
const appendOpen = () => {
  // console.log("[Tranquil Lyrics Debug] appendOpen");
  getTranquilSidebarActiveBody().classList.add("TranquilSidebarLyrics__Active");
};
const appendClosed = () => {
  // console.log("[Tranquil Lyrics Debug] appendClosed");
  getTranquilSidebarActiveBody().classList.remove("TranquilSidebarLyrics__Active");
};

export const getQueuePlaybarButton = () => {
  // console.log("[Tranquil Lyrics Debug] getNowPlayingViewPlaybarButton");
  return document.querySelector<HTMLElement>('[data-testid="control-button-queue"]');
};

const getDevicesPlaybarButton = () => {
  // console.log("[Tranquil Lyrics Debug] getNowPlayingViewPlaybarButton");
  return document.querySelector<HTMLElement>('[data-restore-focus-key="device_picker"]') ?? document.querySelector<HTMLElement>('[aria-describedby="connect-message-nudge"]');
};

export const getQueueContainer = () => {
  return getQueueContainerElement();
};

export let isTranquilSidebarMode = false;

/* const playbarButton = new Spicetify.Playbar.Button(
    "Tranquil Sidebar Lyrics",
    "lyrics",
    () => {
        // console.log("[Tranquil Lyrics Debug] playbarButton clicked", { isTranquilSidebarMode });
        if (isTranquilSidebarMode) {
            CloseSidebarLyrics();
        } else {
            OpenSidebarLyrics();
        }
    },
    false,
    false
);
 */
export function RegisterSidebarLyrics() {
  // console.log("[Tranquil Lyrics Debug] RegisterSidebarLyrics");
  //playbarButton.register();
}

let currentNPVWhentil: CancelableTask | null = null;
let onOpen_wasThingOpen: string | undefined;

// --- Helper to observe removal of #TranquilLyricsPage ---
let tranquilLyricsPageObserver: MutationObserver | null = null;
let tranquilSidebarAsideObserver: MutationObserver | null = null;

export function cleanupSidebarLyricsObservers() {
  if (tranquilLyricsPageObserver) {
    try {
      tranquilLyricsPageObserver.disconnect();
    } catch (_e) {}
    tranquilLyricsPageObserver = null;
  }
  if (tranquilSidebarAsideObserver) {
    try {
      tranquilSidebarAsideObserver.disconnect();
    } catch (_e) {}
    tranquilSidebarAsideObserver = null;
  }
}

/**
 * Observes removal of #TranquilLyricsPage and also addition of a new <aside> 
 * into the parent container. Cleanup occurs if either event happens.
 */
function observeTranquilLyricsPageRemoval(cleanupFn: () => void) {
  cleanupSidebarLyricsObservers();

  const tranquilLyricsEl = document.querySelector("#TranquilLyricsPage");
  if (!tranquilLyricsEl) return;
  const parent = tranquilLyricsEl.parentElement;
  if (!parent) return;

  // Observe for removal of #TranquilLyricsPage
  tranquilLyricsPageObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const n of Array.from(mutation.removedNodes)) {
        if (n === tranquilLyricsEl) {
          cleanupSidebarLyricsObservers();
          cleanupFn();
          return;
        }
      }
    }
  });
  tranquilLyricsPageObserver.observe(parent, { childList: true });

  // Observe for new <aside> being added to the parent container
  tranquilSidebarAsideObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const n of Array.from(mutation.addedNodes)) {
        if (n instanceof HTMLElement && n.tagName === "ASIDE") {
          cleanupSidebarLyricsObservers();
          cleanupFn();
          return;
        }
      }
    }
  });
  tranquilSidebarAsideObserver.observe(parent, { childList: true });
}


function runPageOpenWithCleanup(parentContainer: HTMLElement) {
  PageView.Open(parentContainer, true);
  // After opening, observe #TranquilLyricsPage for removal and cleanup
  // Use setTimeout to wait for DOM update
  setTimeout(() => {
    observeTranquilLyricsPageRemoval(() => {
      // Only run cleanup if we're still in sidebar mode
      if (isTranquilSidebarMode) {
        // Do the main close, but suppress playbar button restoration
        CloseSidebarLyrics(true);
      }
    });
  }, 1);
}

export function OpenSidebarLyrics(wasOpenForceUndefined: boolean = false) {
  onOpen_wasThingOpen = undefined;
  // console.log("[Tranquil Lyrics Debug] OpenSidebarLyrics");
  if (isTranquilSidebarMode) {
    // console.log("[Tranquil Lyrics Debug] already in sidebar mode, returning");
    return;
  }
  const playbarButton = getQueuePlaybarButton();
  if (!playbarButton) {
    console.error("[Tranquil Lyrics] Playbar button is missing");
    return;
  }
  const parentContainer = getNowPlayingViewParentContainer();
  if (!parentContainer) {
    console.error("[Tranquil Lyrics] Now Playing View parent container is missing");
    return;
  }
  const finalContainer = getQueueContainer();
  if (getParentContainerChildren(parentContainer)) {
    onOpen_wasThingOpen = wasOpenForceUndefined
      ? undefined
      : getNowPlayingViewContainer()
        ? "npv"
        : getDevicesContainerElement()
          ? "devices"
          : finalContainer
            ? "queue"
            : undefined;
  }
  appendOpen();
  if (!finalContainer) {
    // console.log("[Tranquil Lyrics Debug] finalContainer not found, clicking button and waiting");
    playbarButton.click();
    currentNPVWhentil = Whentil.When(
      () => getQueueContainer() && !PageView.IsOpened,
      () => {
        // console.log("[Tranquil Lyrics Debug] finalContainer appeared after click");
        runPageOpenWithCleanup(parentContainer);
        currentNPVWhentil?.Cancel();
        currentNPVWhentil = null;
        SetupQueueButtonListener();
      }
    );
  } else {
    // console.log("[Tranquil Lyrics Debug] finalContainer found, opening page view");
    currentNPVWhentil = Whentil.When(
      () => finalContainer && !PageView.IsOpened,
      () => {
        // console.log("[Tranquil Lyrics Debug] Whentil with existing container");
        runPageOpenWithCleanup(parentContainer);

        currentNPVWhentil?.Cancel();
        currentNPVWhentil = null;
        SetupQueueButtonListener();
      }
    );
  }

  isTranquilSidebarMode = true;
  storage.set("sidebar-status", "open");

  // console.log("[Tranquil Lyrics Debug] isTranquilSidebarMode set to true");
}

export function CloseSidebarLyrics(auto: boolean = false) {
  // console.log("[Tranquil Lyrics Debug] CloseSidebarLyrics");
  if (!isTranquilSidebarMode) {
    // console.log("[Tranquil Lyrics Debug] not in sidebar mode, returning");
    return;
  }

  currentNPVWhentil?.Cancel();
  currentNPVWhentil = null;
  
  cleanupSidebarLyricsObservers();

  // console.log("[Tranquil Lyrics Debug] PageView.Destroy()");
  PageView.Destroy();
  appendClosed();
  CleanupQueueButtonListener();
  isTranquilSidebarMode = false;
  storage.set("sidebar-status", "closed");

  if (!auto) {
    if (onOpen_wasThingOpen === undefined) {
      const queuePlaybarButton = getQueuePlaybarButton();
      if (!queuePlaybarButton) {
        console.error("[Tranquil Lyrics] Queue playbar button is missing");
        return;
      }
      queuePlaybarButton.click();
    } else if (onOpen_wasThingOpen === "npv") {
      const playbarButton = getNowPlayingViewPlaybarButton();
      if (!playbarButton) {
        console.error("[Tranquil Lyrics] Now Playing View playbar button is missing");
        return;
      }
      playbarButton.click();
    } else if (onOpen_wasThingOpen === "queue") {
      const queuePlaybarButton = getQueuePlaybarButton();
      if (!queuePlaybarButton) {
        console.error("[Tranquil Lyrics] Queue playbar button is missing");
        return;
      }
      queuePlaybarButton.click();
    } else if (onOpen_wasThingOpen === "devices") {
      const devicesPlaybarButton = getDevicesPlaybarButton();
      if (!devicesPlaybarButton) {
        console.error("[Tranquil Lyrics] Devices playbar button is missing");
        return;
      }
      devicesPlaybarButton.click();
    }
  }

  onOpen_wasThingOpen = undefined;
}

let QBClickELController: AbortController | undefined = undefined;

export function SetupQueueButtonListener() {
  const button = getQueuePlaybarButton();

  if (!button) return;

  const abortController = new AbortController();
  QBClickELController = abortController;
  button.addEventListener(
    "click",
    () => {
      if (!isTranquilSidebarMode) return;
      currentNPVWhentil?.Cancel();
      currentNPVWhentil = null;
      if (tranquilLyricsPageObserver) {
        try { tranquilLyricsPageObserver.disconnect(); } catch(_e){}
        tranquilLyricsPageObserver = null;
      }
      PageView.Destroy();
      appendClosed();
      isTranquilSidebarMode = false;
      button.click();
    },
    { signal: abortController.signal }
  );
}

export function CleanupQueueButtonListener() {
  if (!QBClickELController) return;
  QBClickELController?.abort();
  QBClickELController = undefined;
}

Spicetify.Player.addEventListener("songchange", (e: any) => {
  if (e.data === null) {
    CloseSidebarLyrics();
  }
});
