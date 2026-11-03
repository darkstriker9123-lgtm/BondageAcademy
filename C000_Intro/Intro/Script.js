// Chapter 0 - Intro Load (pre-day story intro, not part of Day 01–100)
function C000_Intro_Intro_Load() {

	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	PlayerTransitionFrame = 1;
	if (typeof PlayerTransitionAutoTimer !== "undefined") PlayerTransitionAutoTimer = 0;

	// Early morning placeholder time
	StopTimer(8 * 60 * 60 * 1000);

}

// Chapter 0 - Intro Run
function C000_Intro_Intro_Run() {

	// Background and player (animate Player01–08)
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, { x: 900, y: 40, w: 980, h: 1200, pad: 8 });
	else
		DrawPlayerTransition();

	// Semi-transparent text panel (not opaque)
	DrawRect(40, 10, 820, 920, "rgba(18,10,24,0.45)");

	// Story intro — click to reveal lines (Bondage College style)
	DrawText(GetText("Intro1"), 450, 50, "White");
	if (TextPhase >= 1) DrawText(GetText("Intro2"), 450, 150, "White");
	if (TextPhase >= 2) DrawText(GetText("Intro3"), 450, 250, "White");
	if (TextPhase >= 3) DrawText(GetText("Intro4"), 450, 350, "White");
	if (TextPhase >= 4) DrawText(GetText("Intro5"), 450, 450, "White");
	if (TextPhase >= 5) DrawText(GetText("Intro6"), 450, 550, "White");
	if (TextPhase >= 6) DrawText(GetText("Intro7"), 450, 650, "White");
	if (TextPhase >= 7) DrawText(GetText("Intro8"), 450, 750, "White");
	if (TextPhase >= 8) DrawText(GetText("Intro9"), 450, 850, "White");

}

// Chapter 0 - Intro Click
function C000_Intro_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 9)
		SetScene(CurrentChapter, "CreatePlayer");
}
