// Verify im not dumb
console.log('JS is yes.');

// Magic numbers and all that floats
const stage = document.querySelector('.stage')
const targetWidth = 1416;
const targetHeight = 712;
var curtainsClosed = false;

let currentActIndex = 1;
let currentSceneIndex = 1;
let acts = [];

// Call action
function loadActsData() {
	acts = script || {};
}

// Scene 1 take 3
function loadScene(sceneIndex) {
	const currentAct = acts['act' + currentActIndex];
	const currentScene = currentAct['scene' + sceneIndex];

	if (!currentScene) {
		console.error('Invalid scene index: ', sceneIndex);
		return;
	}

	const backgroundSrc = 'static/images/background/' + currentAct.background;
	const imgElement = document.querySelector('.background img');
	imgElement.src = backgroundSrc;

	const layers = ['front', 'mid', 'back'];
	cancelMovement();
	layers.forEach(layerName => {
		const layerData = currentScene[layerName];
		const actorContainerSelector = `.actorContainer.${layerName}`;
		const decorationContainerSelector = `.decorationContainer.${layerName}`;
		createEntitiesForLayer(layerData, actorContainerSelector, decorationContainerSelector);
	});
}

// Sticks + Glue + Paper = Puppet
function createEntitiesForLayer(layerData, actorSelector, decorationSelector) {
	const actorContainer = document.querySelector(actorSelector);
	const decorationContainer = document.querySelector(decorationSelector);
	if (!actorContainer || !decorationContainer) {
		console.error('Error finding container element!');
		return;
	}

	const decorations = layerData.decorations;
	for (const decorationKey in decorations) {
		const decorationData = decorations[decorationKey];
		let decorationElement = document.getElementById(decorationKey);

		if (!decorationElement) {
			decorationElement = createEntityElement('static/images/decoration/' + decorationData.sprite);
			decorationElement.id = decorationKey;
		}
		const child = decorationElement.querySelector('img')
		child.src = 'static/images/decoration/' + decorationData.sprite
		setPos(decorationElement, decorationData.start.x, decorationData.start.y, decorationData.scale, decorationData.origin.x, decorationData.origin.y, decorationData.end.x, decorationData.end.y, decorationData.end.speed, decorationData.end.delay, decorationData.end.ease);
		animate(decorationElement, decorationData.animations, decorationData.origin.x, decorationData.origin.y);
		decorationContainer.appendChild(decorationElement);
	}

	const actors = layerData.actors;
	for (const actorKey in actors) {
		const actorData = actors[actorKey];
		let actorElement = document.getElementById(actorKey);

		if (!actorElement) {
			actorElement = createEntityElement('static/images/actor/' + actorData.sprite);
			actorElement.id = actorKey;
		}
		const child = actorElement.querySelector('img')
		child.src = 'static/images/actor/' + actorData.sprite;
		setPos(actorElement, actorData.start.x, actorData.start.y, actorData.scale, actorData.origin.x, actorData.origin.y, actorData.end.x, actorData.end.y, actorData.end.speed, actorData.end.delay, actorData.end.ease);
		animate(actorElement, actorData.animations, actorData.origin.x, actorData.origin.y);
		actorContainer.appendChild(actorElement);
	}
}
function createEntityElement(sprite) {
	const entityElement = document.createElement('div');
	entityElement.classList.add('entity');

	const imageElement = document.createElement('img');
	imageElement.src = `${sprite}`;
	imageElement.alt = `Entity`
	entityElement.appendChild(imageElement);

	return entityElement;
}

// Here and there, dance with ants in ya pants
let elementTimeoutIds = [];
function setPos(element, xStart, yStart, scale, originx, originy, xEnd, yEnd, speed, delay, ease) {

	const x = ((xStart / 100) * targetWidth);
	const y = ((yStart / 100) * targetHeight);

	element.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;

	let timeoutId = setTimeout(() => {
		const xTo = ((xEnd / 100) * targetWidth);
		const yTo = ((yEnd / 100) * targetHeight);
		element.style.transition = `transform ${speed}s ${ease}`;
		element.style.transform = `translate(${xTo}px, ${yTo}px)  scale(${scale})`;
	}, delay * 1000 + 1)
	elementTimeoutIds.push(timeoutId);

	timeoutId = setTimeout(() => {
		element.style.transition = `transform 0.5s ease`;
	}, speed * 1000 + delay * 1000 + 1)
	elementTimeoutIds.push(timeoutId);
}
function animate(element, animations, originx, originy) {
	const child = element.querySelector('img')

	child.style.transformOrigin = originx + 'px ' + originy + 'px';

	let timeoutId = ""
	if (animations !== []) {
		animations.forEach(function (animation) {
			timeoutId = setTimeout(() => {
				var animationName = animation.type || 'walk';
				child.style.animationName = animationName;
				child.style.animationDuration = animation.speed + 's';
				child.style.animationTimingFunction = animation.ease;
				child.style.animationIterationCount = (animation.duration === -1 ? 'infinite' : animation.duration);
			}, animation.delay * 1000)
			elementTimeoutIds.push(timeoutId);
		});

	}
}
function cancelMovement() {
	elementTimeoutIds.forEach(id => clearTimeout(id));
}


function onNextButtonClick() {
	const currentAct = acts['act' + currentActIndex];
	const currentScene = currentAct['scene' + currentSceneIndex];

	if (!currentScene) {
		currentSceneIndex = 1;
		currentActIndex += 1;
		closeCurtains();
		return;
	}

	if (!currentAct) {
		closeCurtains();
		return;
	}
	
	loadScene(currentSceneIndex);
	openCurtains();
	currentSceneIndex += 1;
}


function closeCurtains() {
	curtainLeft.style.transform = 'translateX(0%)';
	curtainRight.style.transform = 'translateX(0%)';
	curtainsClosed = true;
	setTimeout(function () {
		clearScene()
		curtainsClosed = false
	}, 2000);
}
function clearScene() {
	var actors = document.querySelectorAll('.' + 'actorContainer');
	actors.forEach(function (element) {
		element.innerHTML = "";
	});

	var decoration = document.querySelectorAll('.' + 'decorationContainer');
	decoration.forEach(function (element) {
		element.innerHTML = "";
	});
}
function openCurtains() {
	curtainLeft.style.transform = 'translateX(-100%)';
	curtainRight.style.transform = 'translateX(100%)';
}


function logCursor(event) {
	const dx = event.pageX;
	const dy = event.pageY;
	const cx = event.clientX;
	const cy = event.clientY;

	//console.log('\n\nPG - X:', dx, 'Y:', dy, '\nVP - X:', cx, 'Y:', cy);
}

document.addEventListener('DOMContentLoaded', function () {
	loadActsData();

	document.addEventListener('keydown', function (event) {
		if (!curtainsClosed) {
			if (event.key === 'ArrowRight') {
				onNextButtonClick();
			}
		}
	});
});
document.addEventListener('mousemove', logCursor);

















// SCRIPT
script = {
	"act1": {
		"background": "act1.png",
		"scene1": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mesit.png",
						"scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 30, "y": 80 },
						"end": { "x": 30, "y": 10, "speed": 2, "delay": 1, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene2": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -100 },
						"end": { "x": 40, "y": -50, "speed": 3, "delay": 1, "ease": "cubic-bezier(0.25, 1.25, 0.4, 1)" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 30, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene3": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -50 },
						"end": { "x": 40, "y": -65, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"python": {
						"sprite": "python.png", "scale": 1,
						"origin": { "x": 171, "y": 652 },
						"start": { "x": 100, "y": 50 },
						"end": { "x": 50, "y": 40, "speed": 2, "delay": 0, "ease": "ease-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene4": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -65 },
						"end": { "x": 40, "y": -65, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"python": {
						"sprite": "python.png", "scale": 1,
						"origin": { "x": 171, "y": 652 },
						"start": { "x": 50, "y": 40 },
						"end": { "x": 50, "y": 100, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"html": {
						"sprite": "html.png", "scale": 0.9,
						"origin": { "x": 183, "y": 662 },
						"start": { "x": 50, "y": 100 },
						"end": { "x": 50, "y": 35, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene5": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -65 },
						"end": { "x": 40, "y": -65, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"html": {
						"sprite": "html.png", "scale": 0.9,
						"origin": { "x": 183, "y": 662 },
						"start": { "x": 50, "y": 35 },
						"end": { "x": 50, "y": 100, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"css": {
						"sprite": "css.png", "scale": 0.7,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 100 },
						"end": { "x": 50, "y": 15, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene6": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -65 },
						"end": { "x": 40, "y": -65, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"css": {
						"sprite": "css.png", "scale": 0.7,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 15 },
						"end": { "x": 50, "y": 100, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"js": {
						"sprite": "js.png", "scale": 1.2,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 60, "y": 100 },
						"end": { "x": 60, "y": 45, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene7": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -65 },
						"end": { "x": 40, "y": -65, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesitlookright.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": -5, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"js": {
						"sprite": "js.png", "scale": 1.2,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 60, "y": 45 },
						"end": { "x": 60, "y": 120, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"json": {
						"sprite": "json.png", "scale": 0.7,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 100 },
						"end": { "x": 50, "y": 25, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene8": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"languages": {
						"sprite": "languages.png", "scale": 1,
						"origin": { "x": 343, "y": 0 },
						"start": { "x": 40, "y": -65 },
						"end": { "x": 40, "y": -150, "speed": 2, "delay": 0, "ease": "ease" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mesit.png", "scale": 0.7,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -5, "y": 10 },
						"end": { "x": 30, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"json": {
						"sprite": "json.png", "scale": 0.7,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 25 },
						"end": { "x": 50, "y": 100, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease-in-out", "speed": 7, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		}
	},
	"act2": {
		"background": "act2.png",
		"scene1": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 30, "y": 80 },
						"end": { "x": 30, "y": -10, "speed": 2, "delay": 1, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene2": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"html": {
						"sprite": "html.png", "scale": 0.9,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 100 },
						"end": { "x": 50, "y": 25, "speed": 0.4, "delay": 1, "ease": "ease-in-out" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mestandhammer.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 30, "y": -10 },
						"end": { "x": 20, "y": -10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene3": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"html": {
						"sprite": "html.png", "scale": 0.9,
						"origin": { "x": 235, "y": 890 },
						"start": { "x": 50, "y": 25 },
						"end": { "x": 200, "y": 25, "speed": 0.2, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				},
				"actors": {
					"me": {
						"sprite": "mestandhammer.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": -10 },
						"end": { "x": 20, "y": -10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "sledgeswing", "ease": "ease-out", "speed": 1, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0.9 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene4": {
			"front": {
				"decorations": {
					"gradcap": {
						"sprite": "gradcap.png", "scale": 0.4,
						"origin": { "x": 180, "y": 180 },
						"start": { "x": 70, "y": -100 },
						"end": { "x": 70, "y": 100, "speed": 8, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "spin", "ease": "linear", "speed": 2, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			},
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandhammer.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": -10 },
						"end": { "x": -100, "y": -10, "speed": 2, "delay": 10, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		}
	},
	"act3": {
		"background": "act3.png",
		"scene1": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -100, "y": -20 },
						"end": { "x": 10, "y": -20, "speed": 4, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "ease-in-out", "speed": 0.8, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 3.8 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene2": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"holygrail": {
						"sprite": "holygrail.png",
						"scale": 1,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 100, "y": 20 },
						"end": { "x": 70, "y": 20, "speed": 3, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease", "speed": 9, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -20 },
						"end": { "x": 10, "y": -20, "speed": 4, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene3": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {
					"holygrail": {
						"sprite": "holygrail.png",
						"scale": 1,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 70, "y": 20 },
						"end": { "x": 150, "y": 20, "speed": 0, "delay": 4, "ease": "ease-in-out" },
						"animations": [{ "type": "fadeout", "ease": "ease", "speed": 5, "duration": -1, "delay": 0 }]
					},
					"poofgpt": {
						"sprite": "poofgpt.png",
						"scale": 0.8,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 50, "y": 10 },
						"end": { "x": 50, "y": 10, "speed": 0.2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease", "speed": 9, "duration": -1, "delay": 4 }]
					},
					"poof": {
						"sprite": "poof.png",
						"scale": 0.8,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 50, "y": 10 },
						"end": { "x": 150, "y": 10, "speed": 0, "delay": 4, "ease": "ease-in-out" },
						"animations": [{ "type": "fadeout", "ease": "ease", "speed": 5, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -20 },
						"end": { "x": 10, "y": -20, "speed": 4, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene4": {
			"front": {
				"decorations": {
					"gradcap": {
						"sprite": "gradcap.png", "scale": 0.5,
						"origin": { "x": 180, "y": 180 },
						"start": { "x": 70, "y": -100 },
						"end": { "x": 70, "y": 100, "speed": 8, "delay": 10, "ease": "ease-in-out" },
						"animations": [{ "type": "spin", "ease": "linear", "speed": 2, "duration": -1, "delay": 0 }]
					}
				}, "actors": {}
			},
			"mid": {
				"decorations": {
					"holygrail": {
						"sprite": "holygrail.png",
						"scale": 1,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 150, "y": 20 },
						"end": { "x": 150, "y": 20, "speed": 0, "delay": 4, "ease": "ease-in-out" },
						"animations": [{ "type": "fadeout", "ease": "ease", "speed": 5, "duration": -1, "delay": 0 }]
					},
					"poofgpt": {
						"sprite": "poofgpt.png",
						"scale": 0.8,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 50, "y": 10 },
						"end": { "x": 150, "y": 10, "speed": 1, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "bob", "ease": "ease", "speed": 9, "duration": -1, "delay": 4 }]
					},
					"poof": {
						"sprite": "poof.png",
						"scale": 0.8,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 150, "y": 10 },
						"end": { "x": 150, "y": 10, "speed": 0, "delay": 4, "ease": "ease-in-out" },
						"animations": [{ "type": "fadeout", "ease": "ease", "speed": 5, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -20 },
						"end": { "x": -6, "y": -20, "speed": 4, "delay": 2, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"train": {
						"sprite": "languagetrain.png",
						"scale": 0.3,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": 10, "y": -50 },
						"end": { "x": -80, "y": -50, "speed": 7, "delay": 0, "ease": "ease-out" },
						"animations": [{ "type": "chug", "ease": "ease", "speed": 12, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		},
		"scene5": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -6, "y": -20 },
						"end": { "x": 100, "y": -20, "speed": 4, "delay": 5, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "ease-in-out", "speed": 0.8, "duration": -1, "delay": 5 }]
					}
				}
			},
			"back": {
				"decorations": {
					"train": {
						"sprite": "languagetrain.png",
						"scale": 0.3,
						"origin": { "x": 180, "y": 350 },
						"start": { "x": -80, "y": -50 },
						"end": { "x": -200, "y": -50, "speed": 7, "delay": 0, "ease": "ease-in" },
						"animations": [{ "type": "chug", "ease": "ease", "speed": 12, "duration": -1, "delay": 0 }]
					}
				},
				"actors": {}
			}
		}
	},
	"act4": {
		"background": "act4.png",
		"scene1": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -30, "y": -20 },
						"end": { "x": 10, "y": -10, "speed": 8, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "ease-in-out", "speed": 2, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 7.8 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene2": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestand.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -10 },
						"end": { "x": 10, "y": 100, "speed": 0.2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "ease-in-out", "speed": 2, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 7.8 }]
					},
					"mesit": {
						"sprite": "mesitlookright.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 7, "y": 100 },
						"end": { "x": 7, "y": 25, "speed": 0.2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 9, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene3": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"mesit": {
						"sprite": "mesitworry.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 7, "y": 25 },
						"end": { "x": 7, "y": 25, "speed": 8, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene4": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"mesit": {
						"sprite": "mesitcry.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 7, "y": 25 },
						"end": { "x": 7, "y": 25, "speed": 8, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 3, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene5": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"mesit": {
						"sprite": "mesitcry.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 7, "y": 25 },
						"end": { "x": 7, "y": 25, "speed": 15, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "shakesmall", "ease": "ease-in-out", "speed": 0.2, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene6": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"mesit": {
						"sprite": "mesitcry.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 7, "y": 25 },
						"end": { "x": 7, "y": 70, "speed": 1, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "shakesmall", "ease": "ease-in-out", "speed": 0.2, "duration": -1, "delay": 0 }]
					},
					"melay": {
						"sprite": "melay.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 400 },
						"start": { "x": -5, "y": 80 },
						"end": { "x": -5, "y": 60, "speed": 1, "delay": 0.2, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene7": {
			"front": {
				"decorations": {
					"gradcap": {
						"sprite": "gradcap.png", "scale": 0.5,
						"origin": { "x": 180, "y": 180 },
						"start": { "x": 22, "y": -100 },
						"end": { "x": 22, "y": 60, "speed": 8, "delay": 0, "ease": "linear" },
						"animations": [{ "type": "spin", "ease": "linear", "speed": 2, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 8 }]
					}
				}, "actors": {}
			},
			"mid": {
				"decorations": {},
				"actors": {
					"melay": {
						"sprite": "melay.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 400 },
						"start": { "x": -5, "y": 60 },
						"end": { "x": -5, "y": 60, "speed": 1, "delay": 0.2, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene8": {
			"front": {
				"decorations": {
					"gradcap": {
						"sprite": "gradcap.png", "scale": 0.5,
						"origin": { "x": 180, "y": 180 },
						"start": { "x": 22, "y": 60 },
						"end": { "x": 200, "y": -100, "speed": 0.2, "delay": 0, "ease": "linear" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 0 }]
					}
				}, "actors": {}
			},
			"mid": {
				"decorations": {},
				"actors": {
					"melay": {
						"sprite": "melay.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 400 },
						"start": { "x": -5, "y": 60 },
						"end": { "x": -5, "y": 60, "speed": 1, "delay": 0.2, "ease": "ease-in-out" },
						"animations": [{ "type": "sledgeswing", "ease": "ease-out", "speed": 1, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 0.9 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene9": {
			"front": {
				"decorations": {
					"gradcap": {
						"sprite": "gradcap.png", "scale": 0.5,
						"origin": { "x": 180, "y": 180 },
						"start": { "x": 200, "y": -100 },
						"end": { "x": 200, "y": -100, "speed": 0, "delay": 0, "ease": "linear" },
						"animations": []
					}
				}, "actors": {}
			},
			"mid": {
				"decorations": {},
				"actors": {
					"melay": {
						"sprite": "melay.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 400 },
						"start": { "x": -5, "y": 60 },
						"end": { "x": -5, "y": 100, "speed": 1, "delay": 0.2, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 20, "duration": -1, "delay": 0 }]
					},
					"me": {
						"sprite": "mestandsad.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": 120 },
						"end": { "x": 10, "y": -10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 10, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		}
	},
	"act5": {
		"background": "act5.png",
		"scene1": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsad.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -30, "y": -20 },
						"end": { "x": 10, "y": -10, "speed": 12, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 3, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 11.8 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene2": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookup.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -10 },
						"end": { "x": 0, "y": -10, "speed": 3, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 0 }]
					},
					"dragon": {
						"sprite": "dragon.png",
						"scale": 0.8,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 100, "y": 10 },
						"end": { "x": 20, "y": 10, "speed": 2, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene3": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookup.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 0, "y": -10 },
						"end": { "x": 0, "y": -10, "speed": 3, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 0 }]
					},
					"dragon": {
						"sprite": "dragon.png",
						"scale": 0.8,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": 10 },
						"end": { "x": 20, "y": 100, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 0 }]
					},
					"door": {
						"sprite": "door.png",
						"scale": 0.8,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": 100 },
						"end": { "x": 20, "y": 10, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": { "decorations": {}, "actors": {} }
		},
		"scene4": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookup.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 0, "y": -10 },
						"end": { "x": 20, "y": -10, "speed": 3, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 3, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 12, "duration": -1, "delay": 3 }]
					}
				}
			},
			"back": {
				"decorations": {}, "actors": {
					"door": {
						"sprite": "door.png",
						"scale": 0.8,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": 10 },
						"end": { "x": 20, "y": 10, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			}
		},
		"scene5": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookup.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 20, "y": -10 },
						"end": { "x": 100, "y": -10, "speed": 15, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 3, "duration": -1, "delay": 0 }]
					},
					"me2": {
						"sprite": "mestandsad.png",
						"scale": 0.4,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -50, "y": -10 },
						"end": { "x": 100, "y": -10, "speed": 15, "delay": 10, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 2.5, "duration": -1, "delay": 0 }]
					},
					"me3": {
						"sprite": "mestandsad.png",
						"scale": 0.3,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -50, "y": -10 },
						"end": { "x": 100, "y": -10, "speed": 15, "delay": 20, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 2, "duration": -1, "delay": 0 }]
					},
					"me4": {
						"sprite": "mestandsad.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -50, "y": -10 },
						"end": { "x": 10, "y": -10, "speed": 10, "delay": 30, "ease": "ease-in-out" },
						"animations": [{ "type": "walk", "ease": "linear", "speed": 3, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 45 }]
					}
				}
			},
			"back": {
				"decorations": {
					"lightbulb": {
						"sprite": "lightbulboff.png",
						"scale": 1,
						"origin": { "x": 0, "y": 0 },
						"start": { "x": 100, "y": 0 },
						"end": { "x": 0, "y": 0, "speed": 10, "delay": 35, "ease": "ease-in-out" },
						"animations": []
					}
				}, "actors": {
					"door": {
						"sprite": "dooropen.png",
						"scale": 0.8,
						"origin": { "x": 623, "y": 271 },
						"start": { "x": 20, "y": 10 },
						"end": { "x": 20, "y": 10, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "growhuge", "ease": "ease", "speed": 10, "duration": -1, "delay": 0 },
						{ "type": "grownhuge", "ease": "linear", "speed": 12, "duration": -1, "delay": 10 }]
					}
				}
			}
		},
		"scene6": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookupreach.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -10 },
						"end": { "x": 10, "y": -10, "speed": 0, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "clickswitch", "ease": "ease-in-out", "speed": 2, "duration": -1, "delay": 0 },
						{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 2 }]
					},
					"me2": {
						"sprite": "mestandsad.png",
						"scale": 0.4,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -100, "y": -10 },
						"end": { "x": -100, "y": -10, "speed": 15, "delay": 10, "ease": "ease-in-out" },
						"animations": []
					},
					"me3": {
						"sprite": "mestandsad.png",
						"scale": 0.3,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -100, "y": -10 },
						"end": { "x": -100, "y": -10, "speed": 15, "delay": 20, "ease": "ease-in-out" },
						"animations": []
					},
					"me4": {
						"sprite": "mestandsad.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": -100, "y": 0 },
						"end": { "x": -100, "y": 0, "speed": 10, "delay": 30, "ease": "ease-in-out" },
						"animations": []
					}
				}
			},
			"back": {
				"decorations": {
					"lightbulb": {
						"sprite": "lightbulboff.png",
						"scale": 1,
						"origin": { "x": 0, "y": 0 },
						"start": { "x": 0, "y": 0 },
						"end": { "x": 0, "y": 0, "speed": 10, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"lightbulbon": {
						"sprite": "lightbulbon.png",
						"scale": 1,
						"origin": { "x": 0, "y": 0 },
						"start": { "x": 0, "y": 0 },
						"end": { "x": 0, "y": 0, "speed": 0, "delay": 2, "ease": "ease-in-out" },
						"animations": [{ "type": "apear", "ease": "linear", "speed": 2, "duration": 1, "delay": 0 }]
					}
				}, "actors": {
					"door": {
						"sprite": "dooropen.png",
						"scale": 0.8,
						"origin": { "x": 623, "y": 271 },
						"start": { "x": 20, "y": 10 },
						"end": { "x": 20, "y": 10, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "grownhuge", "ease": "linear", "speed": 12, "duration": -1, "delay": 0 }]
					}
				}
			}
		},
		"scene7": {
			"front": { "decorations": {}, "actors": {} },
			"mid": {
				"decorations": {},
				"actors": {
					"me": {
						"sprite": "mestandsadlookuphappy.png",
						"scale": 0.6,
						"origin": { "x": 275, "y": 800 },
						"start": { "x": 10, "y": -10 },
						"end": { "x": 10, "y": -10, "speed": 0, "delay": 0, "ease": "ease-in-out" },
						"animations": [{ "type": "breathe", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 0 }]
					}
				}
			},
			"back": {
				"decorations": {
					"lightbulb": {
						"sprite": "lightbulboff.png",
						"scale": 1,
						"origin": { "x": 10000, "y": 0 },
						"start": { "x": 10000, "y": 0 },
						"end": { "x": 0, "y": 0, "speed": 10, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					},
					"lightbulbon": {
						"sprite": "lightbulbon.png",
						"scale": 1,
						"origin": { "x": 0, "y": 0 },
						"start": { "x": 0, "y": 0 },
						"end": { "x": 0, "y": 0, "speed": 0, "delay": 2, "ease": "ease-in-out" },
						"animations": [{ "type": "none", "ease": "ease-in-out", "speed": 6, "duration": -1, "delay": 0 }]
					}
				}, "actors": {
					"door": {
						"sprite": "dooropen.png",
						"scale": 0.8,
						"origin": { "x": 623, "y": 271 },
						"start": { "x": 10000, "y": 10 },
						"end": { "x": 10000, "y": 10, "speed": 0.5, "delay": 0, "ease": "ease-in-out" },
						"animations": []
					}
				}
			}
		}
	}
}