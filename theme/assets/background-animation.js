const animateBackground = (event) => {
	const center = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2,
	};
	const mousePos = {
		x: event.clientX,
		y: event.clientY,
	};
	const percentagePos = {
		x: (mousePos.x - center.x) / center.x,
		y: (mousePos.y - center.y) / center.y,
	};

	document.body.style.backgroundPosition = `
		${percentagePos.x * 5 + 1}rem
		${percentagePos.y * 5 + 1}rem
	`;
};

window.addEventListener("mousemove", debounce(animateBackground, 100));
