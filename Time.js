// ===== TIME SYSTEM (Remake) =====
// Day starts 07:30, classes 08:30, lunch 11:30 (1h), afternoon break 17:00 (1h),
// evening from 19:30 until 00:00. 30 days total.

var RunTimer = false;
var RunInterval = 20;
var CurrentTimer;
var CurrentTime = 0;			// milliseconds from midnight (or absolute for old scenes)
var LimitTimer = 0;
var LimitChapter = "";
var LimitScreen = "";

// New day system
var CurrentDay = 1;				// 1 to 30
var MaxDay = 30;

// Time of day in minutes from midnight (easier for schedule)
// 07:30 = 450, 08:30 = 510, 11:30 = 690, 12:30 = 750,
// 17:00 = 1020, 18:00 = 1080, 19:30 = 1170, 24:00 = 1440
var CurrentMinute = 450;		// start of day = 07:30

// Convert milliseconds to written time (kept for compatibility)
function msToTime(s) {

  function pad(n, z) {
    z = z || 2;
    return ('00' + n).slice(-z);
  }

  var ms = s % 1000;
  s = (s - ms) / 1000;
  var secs = s % 60;
  s = (s - secs) / 60;
  var mins = s % 60;
  var hrs = (s - mins) / 60;
  return pad(hrs) + ':' + pad(mins) + ':' + pad(secs);

}

// Convert CurrentMinute to HH:MM display
function MinuteToTime(m) {
	function pad(n) { return (n < 10 ? "0" : "") + n; }
	var h = Math.floor(m / 60) % 24;
	var min = m % 60;
	return pad(h) + ":" + pad(min);
}

// Get current time as HH:MM
function GetCurrentTimeString() {
	return MinuteToTime(CurrentMinute);
}

// Runs the regular timer (screen refresh + old limit system)
function ProcessTimer() {

	clearInterval(CurrentTimer);
	CurrentTimer = setInterval("MainRun()", RunInterval);
	if (typeof PlayerSkillShowLevelUp !== "undefined" && PlayerSkillShowLevelUp > 0) PlayerSkillShowLevelUp--;

	if (RunTimer) {
		CurrentTime = CurrentTime + RunInterval;

		if (CurrentTime >= LimitTimer) {
			CurrentTime = LimitTimer;
			SetScene(LimitChapter, LimitScreen);
		}
	}

}

// Starts the timer and sets the limits (old system, still used by some scenes)
function StartTimer(LTimer, LChapter, LScreen) {
	RunTimer = true;
	LimitTimer = LTimer;
	LimitChapter = LChapter;
	LimitScreen = LScreen;
	LeaveIcon = "Wait";
	TextPhase = 0;
}

// Stops the timer at a fixed time
function StopTimer(FixedTime) {
	RunTimer = false;
	CurrentTime = FixedTime;
	TextPhase = 0;
	LoadText();
}

// ===== NEW DAY / SCHEDULE SYSTEM =====

// Schedule constants (minutes from midnight)
var TIME_DAY_START        = 450;	// 07:30
var TIME_CLASS_START      = 510;	// 08:30
var TIME_LUNCH_START      = 690;	// 11:30
var TIME_LUNCH_END        = 750;	// 12:30
var TIME_AFTERNOON_START  = 1020;	// 17:00
var TIME_AFTERNOON_END    = 1080;	// 18:00
var TIME_EVENING_START    = 1170;	// 19:30
var TIME_NIGHT_START      = 1170;	// 19:30+
var TIME_DAY_END          = 1440;	// 24:00

// Returns true if current day is a weekend (Day 1 and 2 are weekend intro, then every 6-7)
// Simple version: Day 1 & 2 = weekend, then Sat/Sun based on calendar if needed
function IsWeekend() {
	// First two days are special weekend exploration
	if (CurrentDay === 1 || CurrentDay === 2) return true;
	// After that: treat day % 7 == 6 or 0 as weekend (optional, can refine later)
	var d = (CurrentDay - 2) % 7;	// after the first two days
	return (d === 5 || d === 6);	// 5=Sat, 6=Sun style
}

// Returns the current period name
function GetTimePeriod() {
	if (CurrentMinute < TIME_CLASS_START) return "Morning";
	if (CurrentMinute < TIME_LUNCH_START) return "Class";
	if (CurrentMinute < TIME_LUNCH_END) return "Lunch";
	if (CurrentMinute < TIME_AFTERNOON_START) return "AfternoonClass";
	if (CurrentMinute < TIME_AFTERNOON_END) return "AfternoonBreak";
	if (CurrentMinute < TIME_EVENING_START) return "LateAfternoon";
	if (CurrentMinute < TIME_DAY_END) return "Evening";
	return "Night";
}

// True if it is night (after 19:30)
function IsNight() {
	return CurrentMinute >= TIME_NIGHT_START;
}

// True if outside kidnapping is allowed (Day 22+)
function CanBeKidnappedOutside() {
	return CurrentDay >= 22;
}

// True if Hidden Authority can be discovered (Day 8+)
function CanDiscoverHiddenAuthority() {
	return CurrentDay >= 8;
}

// True if Lover betrayal / blackmail can trigger (Day 15+)
function CanLoverBetrayal() {
	return CurrentDay >= 15;
}

// Add minutes to the current day time
function AddMinutes(mins) {
	CurrentMinute += mins;
	if (CurrentMinute >= TIME_DAY_END) {
		CurrentMinute = TIME_DAY_END;
	}
	// Also keep old CurrentTime roughly in sync if needed
	CurrentTime = CurrentMinute * 60000;
}

// Set exact time (minutes from midnight)
function SetTime(minutes) {
	CurrentMinute = minutes;
	if (CurrentMinute < 0) CurrentMinute = 0;
	if (CurrentMinute > TIME_DAY_END) CurrentMinute = TIME_DAY_END;
	CurrentTime = CurrentMinute * 60000;
}

// Helper: build chapter name from day number (C001_Day01, C010_Day10, C030_Day30)
function BuildDayChapterName(day) {
	var chapterNum = ("000" + day).slice(-3);	// 001, 010, 030
	var dayNum = ("00" + day).slice(-2);		// 01, 10, 30
	return "C" + chapterNum + "_Day" + dayNum;
}

// Start a new day (call when player sleeps / day advances)
function StartNewDay() {
	if (CurrentDay >= MaxDay) {
		// Go to Outro
		SetScene("C031_Outro", "Outro");
		return;
	}
	CurrentDay++;
	CurrentMinute = TIME_DAY_START;	// 07:30
	CurrentTime = CurrentMinute * 60000;
	Common_PlayerEscaped = false;
	SetScene(BuildDayChapterName(CurrentDay), "Start");
}

// Force jump to a specific day (for testing / events)
function SetDay(day) {
	if (day < 1) day = 1;
	if (day > MaxDay) day = MaxDay;
	CurrentDay = day;
	CurrentMinute = TIME_DAY_START;
	CurrentTime = CurrentMinute * 60000;
}

// Get chapter name for current day
function GetCurrentDayChapter() {
	return BuildDayChapterName(CurrentDay);
}

// Convenience: advance to lunch / afternoon / evening
function GoToLunch()        { SetTime(TIME_LUNCH_START); }
function GoToAfternoonBreak(){ SetTime(TIME_AFTERNOON_START); }
function GoToEvening()      { SetTime(TIME_EVENING_START); }
function GoToNight()        { SetTime(TIME_NIGHT_START); }

// Check if player can sneak out (evening on weekdays)
function CanSneakOut() {
	return !IsWeekend() && IsNight() && !Common_PlayerRestrained && !Common_PlayerInCage;
}
