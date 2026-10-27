// ===== STRUGGLE MINI-GAME =====
// Click-the-spot struggle. Difficulty scales with RopeMastery skill.
// Positions (SX, SY, SRadius) are passed by the calling scene.

var StruggleType = "";
var StruggleDifficulty = "";
var StruggleDifficultyShown = "";
var StruggleMessage = "";
var StruggleDoneMessage = "";
var StruggleX = 0;
var StruggleY = 0;
var StruggleRadius = 0;
var StruggleProgress = 0;
var StruggleNextTick = 0;
var StruggleDone = false;
var StruggleImageFrame = 0;
var StruggleImageFrameMax = 1;
var StruggleImageFrameTime = 0;
var StruggleSkillBonus = 0;

function StruggleLoad() {
	StruggleDone = false;
	StruggleProgress = 0;
	StruggleSkillBonus = PlayerGetSkillLevel("RopeMastery");
}

function StruggleGetNextTick() {
	if ((StruggleDifficulty == "Easy") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 600;
	if ((StruggleDifficulty == "Easy") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 450;
	if ((StruggleDifficulty == "Easy") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 300;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 400;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 325;
	if ((StruggleDifficulty == "Normal") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 250;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 300;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 225;
	if ((StruggleDifficulty == "Hard") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 150;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress <= 33)) StruggleNextTick = CurrentTime + 250;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress > 33) && (StruggleProgress <= 66)) StruggleNextTick = CurrentTime + 125;
	if ((StruggleDifficulty == "Impossible") && (StruggleProgress > 66)) StruggleNextTick = CurrentTime + 10;
}

function StruggleClick(SType, SDifficulty, SMessage, SDoneMessage, SX, SY, SRadius) {
	if ((MouseX >= SX - SRadius) && (MouseX <= SX + SRadius) && (MouseY >= SY - SRadius) && (MouseY <= SY + SRadius)) {
		if ((SType != StruggleType) || (StruggleDifficultyShown == "")) {
			StruggleType = SType;
			StruggleDifficulty = SDifficulty;
			StruggleDifficultyShown = GetText(SDifficulty);
			StruggleMessage = SMessage;
			StruggleDoneMessage = SDoneMessage;
			StruggleX = SX;
			StruggleY = SY;
			StruggleRadius = SRadius;
			StruggleProgress = 0;	
			StruggleDone = false;
			StruggleGetNextTick();
		}
		if (StruggleProgress <= 0) StruggleProgress = 8;
		StruggleProgress = StruggleProgress + 2 + StruggleSkillBonus;
		if (StruggleProgress >= 100) {
			StruggleProgress = 100;
			StruggleDone = true;
			StruggleNextTick = CurrentTime + 6000;
		}
	}
}

function StruggleGetImage(StruggleStage) {
	if (StruggleImageFrameTime < CurrentTime) {
		if (StruggleProgress <= 0) StruggleImageFrameTime = CurrentTime + 3000;
		else if (StruggleProgress <= 33) StruggleImageFrameTime = CurrentTime + 1000;
		else if (StruggleProgress <= 66) StruggleImageFrameTime = CurrentTime + 500;
		else StruggleImageFrameTime = CurrentTime + 250;
		StruggleImageFrame++;
		if (StruggleImageFrame > StruggleImageFrameMax) StruggleImageFrame = 0;
	}
	if (StruggleProgress >= 100) return StruggleStage + "_Done";
	return StruggleStage + "_" + StruggleImageFrame.toString();
}

function StruggleRun() {
	if ((StruggleProgress > 0) && (StruggleProgress < 100) && (CurrentTime >= StruggleNextTick)) {
		StruggleProgress = StruggleProgress - 1;
		if (StruggleProgress < 0) StruggleProgress = 0;
		StruggleGetNextTick();
	}
}
