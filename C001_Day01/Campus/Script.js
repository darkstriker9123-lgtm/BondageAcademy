// C001_Day01 — Campus hub
// Zones: Notice | Rope case | Sidney | Dorm | End day (if bind done)

var C001_Day01_Campus_StatusText = "";

function C001_Day01_Campus_Load() {
	CurrentActor = "";
	// Keep day clock running while exploring (evening limit soft)
	if (typeof CurrentMinute === "undefined" || CurrentMinute < 450)
		CurrentMinute = 450; // 07:30
	if (typeof StartTimer === "function")
		StartTimer(0, "", ""); // RunTimer on, no auto scene jump
	else if (typeof RunTimer !== "undefined")
		RunTimer = true;
	LeaveIcon = "";
	LeaveScreen = "";
	Common_BondageAllowed = true;
	Common_SelfBondageAllowed = false;
	C001_Day01_Campus_StatusText = "";
	if (typeof LoadText === "function") LoadText();
	// Safety: intake rope if missing
	if (typeof PlayerHasInventory === "function" && !PlayerHasInventory("Rope")) {
		if (typeof PlayerAddInventory === "function") PlayerAddInventory("Rope", 1);
	}
}

function C001_Day01_Campus_IsBindDone() {
	if (typeof C001_Day01_Sidney_BindResolved !== "undefined" && C001_Day01_Sidney_BindResolved)
		return true;
	if (typeof GameLogQuery === "function") {
		if (GameLogQuery(CurrentChapter, "", "BindResolvedDay1")) return true;
		if (GameLogQuery(CurrentChapter, "Sidney", "BindResolvedDay1")) return true;
	}
	return false;
}

function C001_Day01_Campus_DrawZone(x, y, w, h, label, hover) {
	DrawRect(x, y, w, h, hover ? "rgba(200,80,120,0.35)" : "rgba(18,10,24,0.45)");
	MainCanvas.strokeStyle = hover ? "rgba(255,180,200,0.8)" : "rgba(255,200,220,0.35)";
	MainCanvas.lineWidth = 2;
	MainCanvas.strokeRect(x, y, w, h);
	MainCanvas.font = UI_FONT_SM;
	MainCanvas.fillStyle = "#ffffff";
	MainCanvas.textAlign = "center";
	MainCanvas.textBaseline = "middle";
	MainCanvas.fillText(label, x + w / 2, y + h / 2);
}

function C001_Day01_Campus_Run() {
	DrawImage(CurrentChapter + "/" + CurrentScreen + "/Background.jpg", 0, 0);

	var cn = (typeof CurrentLanguageTag !== "undefined" && CurrentLanguageTag == "CN");
	var sidneyDone = false;
	if (typeof C001_Day01_Sidney_IsDone === "function") sidneyDone = C001_Day01_Sidney_IsDone();
	else if (typeof C001_Day01_Sidney_Done !== "undefined" && C001_Day01_Sidney_Done) sidneyDone = true;
	else if (typeof GameLogQuery === "function" && GameLogQuery(CurrentChapter, "", "SidneySceneDoneDay1")) sidneyDone = true;
	var z = [
		{ x: 80, y: 180, w: 360, h: 140, label: cn ? "公告板" : "Notice board", id: "notice" },
		{ x: 480, y: 520, w: 360, h: 160, label: cn ? "练习绳箱" : "Rope case", id: "rope" },
		{ x: 1620, y: 420, w: 260, h: 280, label: cn ? "宿舍" : "Dorm", id: "dorm" }
	];
	if (!sidneyDone) {
		z.splice(2, 0, { x: 1100, y: 160, w: 480, h: 720, label: cn ? "小径 · Sidney" : "Path · Sidney", id: "sidney" });
	}
	if (C001_Day01_Campus_IsBindDone()) {
		z.push({ x: 700, y: UI_TOP_H + 20, w: 520, h: 90, label: cn ? "结束这一天" : "End the day", id: "outro" });
	}

	for (var i = 0; i < z.length; i++) {
		var hov = (MouseX >= z[i].x && MouseX <= z[i].x + z[i].w && MouseY >= z[i].y && MouseY <= z[i].y + z[i].h);
		C001_Day01_Campus_DrawZone(z[i].x, z[i].y, z[i].w, z[i].h, z[i].label, hov);
	}

	if (C001_Day01_Campus_StatusText != "") {
		DrawRect(200, 1080, 1520, 80, "rgba(18,10,24,0.7)");
		MainCanvas.font = UI_FONT_SM;
		MainCanvas.fillStyle = "#ffffff";
		MainCanvas.textAlign = "center";
		MainCanvas.textBaseline = "middle";
		MainCanvas.fillText(C001_Day01_Campus_StatusText, 960, 1120);
	}

	if (!C001_Day01_Campus_IsBindDone()) {
		MainCanvas.font = "24px Arial";
		MainCanvas.fillStyle = "rgba(255,255,255,0.85)";
		MainCanvas.textAlign = "center";
		MainCanvas.fillText(cn ? "先去小径见 Sidney。" : "Meet Sidney on the path first.", 960, 1240);
	}
}

function C001_Day01_Campus_Click() {
	if (typeof InventoryClick === "function")
		InventoryClick(GetClickedInventory(), CurrentChapter, "Campus");

	// Notice
	if (MouseX >= 80 && MouseX <= 440 && MouseY >= 180 && MouseY <= 320) {
		C001_Day01_Campus_StatusText = GetText("Notice");
		return;
	}
	// Rope case → RopeSource screen
	if (MouseX >= 480 && MouseX <= 840 && MouseY >= 520 && MouseY <= 680) {
		C001_Day01_Campus_StatusText = "";
		if (typeof AddMinutes === "function") AddMinutes(3);
		SetScene(CurrentChapter, "RopeSource");
		return;
	}
	// Sidney — blocked after "Take care" / scene done
	if (MouseX >= 1100 && MouseX <= 1580 && MouseY >= 160 && MouseY <= 880) {
		var done = false;
		if (typeof C001_Day01_Sidney_IsDone === "function") done = C001_Day01_Sidney_IsDone();
		else if (typeof C001_Day01_Sidney_Done !== "undefined" && C001_Day01_Sidney_Done) done = true;
		if (done) {
			C001_Day01_Campus_StatusText = (cn ? "今天和 Sidney 的事已经谈完了。" : "You are done talking with Sidney today.");
			return;
		}
		C001_Day01_Campus_StatusText = "";
		if (typeof AddMinutes === "function") AddMinutes(2);
		SetScene(CurrentChapter, "Sidney");
		return;
	}
	// Dorm
	if (MouseX >= 1620 && MouseX <= 1880 && MouseY >= 420 && MouseY <= 700) {
		C001_Day01_Campus_StatusText = GetText("DormPath");
		return;
	}
	// Outro
	if (C001_Day01_Campus_IsBindDone() && MouseX >= 700 && MouseX <= 1220 && MouseY >= UI_TOP_H + 20 && MouseY <= UI_TOP_H + 110) {
		C001_Day01_Campus_StatusText = "";
		SetScene(CurrentChapter, "Outro");
		return;
	}
}
