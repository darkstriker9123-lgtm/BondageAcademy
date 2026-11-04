// Chapter 0 - Intro Load (pre-day story intro)
function C000_Intro_Intro_Load() {
	LeaveIcon = "";
	LeaveScreen = "";
	TextPhase = 0;
	PlayerTransitionFrame = 1;
	if (typeof PlayerTransitionAutoTimer !== "undefined") PlayerTransitionAutoTimer = 0;
	if (typeof StopTimer === "function") StopTimer(8 * 60 * 60 * 1000);
}

function C000_Intro_Intro_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);
	if (typeof AdvancePlayerTransitionAuto === "function")
		AdvancePlayerTransitionAuto();
	if (typeof DrawPlayerTransition === "function")
		DrawPlayerTransition(PlayerTransitionFrame, { x: 1000, y: 60, w: 880, h: 1160, pad: 8 });

	// Transparent story panel (left)
	var panelX = 48, panelY = 80, panelW = 900, panelH = 1000;
	DrawRect(panelX, panelY, panelW, panelH, "rgba(12,8,18,0.5)");
	DrawRect(panelX, panelY, panelW, 3, "rgba(255,200,220,0.35)");

	var keys = ["Intro1","Intro2","Intro3","Intro4","Intro5","Intro6","Intro7","Intro8","Intro9"];
	var y = panelY + 40;
	MainCanvas.font = "32px Arial";
	for (var i = 0; i < keys.length; i++) {
		if (i > 0 && TextPhase < i) break;
		var line = (typeof GetText === "function") ? GetText(keys[i]) : keys[i];
		if (typeof DrawWrappedLines === "function")
			y = DrawWrappedLines(line, panelX + 36, y, panelW - 72, 40, "#ffffff") + 18;
		else {
			MainCanvas.fillStyle = "#ffffff";
			MainCanvas.textAlign = "left";
			MainCanvas.fillText(line, panelX + 36, y);
			y += 48;
		}
	}

	MainCanvas.font = "24px Arial";
	MainCanvas.fillStyle = "rgba(255,255,255,0.7)";
	MainCanvas.textAlign = "center";
	MainCanvas.fillText((CurrentLanguageTag == "CN") ? "点击继续" : "Click to continue", panelX + panelW / 2, panelY + panelH - 36);
}

function C000_Intro_Intro_Click() {
	TextPhase++;
	if (TextPhase >= 9)
		SetScene(CurrentChapter, "CreatePlayer");
}
