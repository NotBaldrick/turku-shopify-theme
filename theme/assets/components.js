const prefix = "component";
const mainStyles = `<link href="${window.assetURLs.mainStyles}" rel="stylesheet" type="text/css">`;

/* -------------------------------------------------------------------------- */
/*                              ANCHOR - Sidebar                              */
/* -------------------------------------------------------------------------- */

const sidebarTemplate = document.createElement("template");
sidebarTemplate.innerHTML = `
  ${mainStyles}
  <div id="overlay" class="w-full h-screen bg-neutral bg-opacity-25 opacity-0 transition-opacity duration-500"></div>
  <div id="sidebar-wrapper" class="w-full flex justify-start pointer-events-none">
    <aside
      id="sidebar"
      class="w-5/6 md:w-96 h-screen bg-base-100 shadow-lg border-r-4 border-neutral translate-x-[-100%] transition-transform duration-700 pointer-events-auto"
    >
      <div class="w-full h-full p-2 md:p-4 flex flex-col justify-between gap-2">
        <header class="w-full">
          <slot name="top"></slot>
          <hr class="divider divider-vertical" />
        </header>
        <main class="flex-1 w-full overflow-y-auto">
          <slot></slot>
        </main>
        <footer class="w-full">
          <hr class="divider divider-vertical" />
          <slot name="bottom"></slot>
        </footer>
      </div>
    </aside>
  </div>
`;

class Sidebar extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
		this.side = "left";

		this.classList = "fixed top-0 left-0 z-50 w-full h-screen grid grid-cols-1 grid-rows-1 pointer-events-none";
		document.body.appendChild(this);
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(sidebarTemplate.content.cloneNode(true));
	}

	connectedCallback() {
		this.overlayEl = this.shadowRoot.querySelector("#overlay");
		this.sidebarEl = this.shadowRoot.querySelector("#sidebar");
		this.sidebarWrapperEL = this.shadowRoot.querySelector("#sidebar-wrapper");

		this.overlayEl.addEventListener("click", this.close.bind(this));
		this.setSide();
	}

	disconnectedCallback() {
		this.overlayEl.removeEventListener("click", this.close.bind(this));
	}

	static get observedAttributes() {
		return ["side"];
	}

	attributeChangedCallback(name, oldValue, newValue) {
		if (name === "side") {
			this.side = newValue;
			this.setSide();
		}
	}

	open() {
		if (this.isOpen) return;
		this.isOpen = true;

		this.classList.remove("pointer-events-none");
		this.overlayEl.classList.remove("opacity-0");
		this.sidebarEl.classList.remove(this.side === "left" ? "translate-x-[-100%]" : "translate-x-[100%]");

		this.classList.add("pointer-events-all");
		this.overlayEl.classList.add("opacity-100");
		this.sidebarEl.classList.add("translate-x-[0%]");
	}

	close() {
		if (!this.isOpen) return;
		this.isOpen = false;

		this.classList.remove("pointer-events-all");
		this.overlayEl.classList.remove("opacity-100");
		this.sidebarEl.classList.remove("translate-x-[0%]");

		this.classList.add("pointer-events-none");
		this.overlayEl.classList.add("opacity-0");
		this.sidebarEl.classList.add(this.side === "left" ? "translate-x-[-100%]" : "translate-x-[100%]");
	}

	setSide() {
		if (this.side === "left") {
			this.sidebarWrapperEL?.classList.remove("justify-end");
			this.sidebarEl?.classList.remove("translate-x-[100%]");
			this.sidebarEl?.classList.remove("border-l-4");

			this.sidebarWrapperEL?.classList.add("justify-start");
			this.sidebarEl?.classList.add("translate-x-[-100%]");
			this.sidebarEl?.classList.add("border-r-4");
		} else {
			this.sidebarWrapperEL?.classList.remove("justify-start");
			this.sidebarEl?.classList.remove("translate-x-[-100%]");
			this.sidebarEl?.classList.remove("border-r-4");

			this.sidebarWrapperEL?.classList.add("justify-end");
			this.sidebarEl?.classList.add("translate-x-[100%]");
			this.sidebarEl?.classList.add("border-l-4");
		}
	}
}

customElements.define(`${prefix}-sidebar`, Sidebar);

/* -------------------------------------------------------------------------- */
/*                               ANCHOR - Modal                               */
/* -------------------------------------------------------------------------- */

const modalTemplate = document.createElement("template");
modalTemplate.innerHTML = `
	${mainStyles}
	<div id="overlay" class="w-full h-full bg-neutral bg-opacity-25 absolute transition-opacity duration-700"></div>
	<div class="w-full h-full flex justify-center items-center p-2">
		<aside id="modal" class="w-full sm:w-5/6 md:w-2/3 xl:w-2/4 p-4 bg-base-100 z-10 rounded-xl shadow-xl border-4 border-neutral mb-2 transition-all duration-500 delay-100 relative">
		<button id="close-button" class="absolute top-0.5 right-1 btn btn-circle btn-ghost btn-xs">
			<svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
			<slot></slot>
		</aside>
	</div>
`;

class Modal extends HTMLElement {
	constructor() {
		super();
		this.isOpen = false;
		this.stateStyles = {
			modal: {
				open: ["opacity-100", "pointer-events-auto", "translate-y-0"],
				close: ["opacity-0", "pointer-events-none", "translate-y-10"],
			},
			overlay: {
				open: ["opacity-100", "pointer-events-auto"],
				close: ["opacity-0", "pointer-events-none"],
			},
		};

		this.classList = "block fixed left-0 top-0 z-[100] w-full h-screen pointer-events-none";
		document.body.appendChild(this);
		this.attachShadow({ mode: "open" });
		this.shadowRoot.appendChild(modalTemplate.content.cloneNode(true));
	}

	connectedCallback() {
		this.modalEl = this.shadowRoot.querySelector("#modal");
		this.overlayEl = this.shadowRoot.querySelector("#overlay");
		this.closeButtonEl = this.shadowRoot.querySelector("#close-button");

		this.modalEl.classList.add(...this.stateStyles.modal.close);
		this.overlayEl.classList.add(...this.stateStyles.overlay.close);

		this.overlayEl.addEventListener("click", this.close.bind(this));
		this.closeButtonEl.addEventListener("click", this.close.bind(this));
	}

	disconnectedCallback() {
		this.overlayEl.removeEventListener("click", this.close.bind(this));
		this.closeButtonEl.removeEventListener("click", this.close.bind(this));
	}

	open() {
		this.modalEl.classList.remove(...this.stateStyles.modal.close);
		this.modalEl.classList.add(...this.stateStyles.modal.open);
		this.overlayEl.classList.remove(...this.stateStyles.overlay.close);
		this.overlayEl.classList.add(...this.stateStyles.overlay.open);
	}

	close() {
		this.modalEl.classList.remove(...this.stateStyles.modal.open);
		this.modalEl.classList.add(...this.stateStyles.modal.close);
		this.overlayEl.classList.remove(...this.stateStyles.overlay.open);
		this.overlayEl.classList.add(...this.stateStyles.overlay.close);
	}
}

customElements.define(`${prefix}-modal`, Modal);
