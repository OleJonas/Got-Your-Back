type postureProps = {
	[key in 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8]: string;
};

export const posture_names: postureProps = {
	0: "Straight",
	1: "Forward",
	2: "Forward-right",
	3: "Right",
	4: "Backward-right",
	5: "Backward",
	6: "Backward-left",
	7: "Left",
	8: "Forward-left",
};
export default posture_names;
