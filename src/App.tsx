import React, { useState, useEffect, useRef, useMemo } from "react";

type FrequencyListType = {
	[key: string | number]: number;
};

function App() {
	const [secondsBetweenOutput, setSecondsBetweenOutput] = useState(0);
	const [appStarted, setAppStarted] = useState(false);
	const [timerId, setTimerId] = useState<undefined | NodeJS.Timer>();
	const [number, setNumber] = useState(0);
	const [frequencyList, setFrequencyList] = useState<FrequencyListType>({});
	const fibonacci = useMemo(
		() =>
			Array.from({ length: 1000 }).reduce<number[]>((fibArr, _, index) => {
				if (index < 2) {
					return fibArr.concat(1);
				}
				return fibArr.concat(fibArr[index - 1] + fibArr[index - 2]);
			}, []),
		[]
	);

	console.log({ fibonacci });

	const logFrequencyListRef = useRef<() => void>();
	const haltedRef = useRef(false);

	useEffect(() => {
		logFrequencyListRef.current = () => {
			console.log("Please enter the next number >> ", frequencyList);
		};
	}, [frequencyList]);

	useEffect(() => {
		if (appStarted) {
			const intervalId = setInterval(() => {
				if (!haltedRef.current) {
					logFrequencyListRef.current && logFrequencyListRef.current();
				}
			}, secondsBetweenOutput * 1000);

			setTimerId(intervalId);
		}

		return () => {
			clearInterval(timerId);
		};
		//eslint-disable-next-line
	}, [appStarted]);

	const handleStart = () => {
		secondsBetweenOutput && setAppStarted(true);
	};

	const addNumber = () => {
		if (fibonacci.includes(number)) {
			window.alert("FIB!");
		}

		let shallow = { ...frequencyList };
		if (shallow[number] >= 0) {
			shallow = { ...shallow, [number]: shallow[number] + 1 };
		} else {
			shallow = { ...shallow, [number]: 1 };
		}
		setFrequencyList(shallow);
	};

	const handleQuit = () => {
		console.log("Thanks for playing: ", frequencyList);
		clearInterval(timerId);
		setFrequencyList({});
		setAppStarted(false);
		setSecondsBetweenOutput(0);
	};

	return (
		<div className="App">
			{!appStarted ? (
				<>
					<input
						value={secondsBetweenOutput}
						type="number"
						onChange={(e) => setSecondsBetweenOutput(+e.target.value)}
					/>
					<button onClick={handleStart}>Set time between output</button>
				</>
			) : (
				<>
					<div>
						<input
							value={number}
							onChange={(e) => setNumber(+e.target.value)}
							type="number"
						/>
						<button onClick={addNumber}>Add</button>
					</div>
					<div>
						<button onClick={() => (haltedRef.current = true)}>Halt</button>
						<button onClick={() => (haltedRef.current = false)}>Resume</button>
						<button onClick={handleQuit}>Quit</button>
					</div>
				</>
			)}
		</div>
	);
}

export default App;
