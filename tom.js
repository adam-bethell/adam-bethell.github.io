$(function() {
    //=======================================
    // Initiative Tracker
    //=======================================

    $initiative_records = $("#initiative-tracker tbody");

    // Enabled records buttons
    $enabled_records_buttons = $("<td>")
        .append($("<input>").attr({"type":"button","value":"Disable"}).addClass("disable_initiative_record"));

    // Disabled records buttons
    $disabled_records_buttons = $("<td>")
        .append($("<input>").attr({"type":"button","value":"Enable"}).addClass("enable_initiative_record"))
        .append($("<input>").attr({"type":"button","value":"Delete"}).addClass("delete_initiative_record"));

    // Create a new record
    function create_initiative_record(name, initiative, dexterity) {
        $new_row = $("<tr>").addClass("enabled");
        $new_row.append($("<td>").text(name));
        $new_row.append($("<td>").text(initiative));
        $new_row.append($("<td>").text(dexterity));
        $new_row.append($enabled_records_buttons.clone())
        return $new_row
    }

    // Highlight the first record
    function highlight_first_initiative_record() {
        if ($initiative_records.length > 0) {
            unhighlight_initiative_records();
            $tr = $initiative_records.children(".enabled").first();
            $tr.addClass("initiative_record_highlighted");
        }
    }

    function unhighlight_initiative_records() {
        $initiative_records.children().each(function() {
            $(this).removeClass("initiative_record_highlighted");
        });
    }

    // Move the highlight down 1 row
    function highlight_next_initiative_record() {
        $current_row = $initiative_records.find(".initiative_record_highlighted");
        if ($current_row.length == 0) {
            highlight_first_initiative_record();
            return
        }

        $current_row.removeClass("initiative_record_highlighted");
        $next_row = $current_row.next(".enabled").first();
        if ($next_row.length == 0) {
            highlight_first_initiative_record();
        }
        else {
            $next_row.addClass("initiative_record_highlighted");
        }
    }

    // Get name from highlighted row
    function get_highlighted_initiative_record_name() {
        $current_row = $initiative_records.find(".initiative_record_highlighted");
        return $current_row.children().first().text();
    }

    // Order existing records
    function order_initiative_records() {
        $records = $("#initiative-tracker tbody tr");
        $ordered_records = [];

        var lowest_initiative = 99999;
        var lowest_dexterity = 99999;
        var lowest_index = 0;
        while($records.length > 0) {
            for (var i = 0; i < $records.length; i++) {
                var $tr = $records[i]
                var $td = $tr.children[1];
                var initiative = $($td).text();
                $td = $tr.children[2];
                var dexterity = $($td).text();
                if (initiative < lowest_initiative ||
                    (initiative == lowest_initiative && dexterity < lowest_dexterity)) {
                    lowest_initiative = initiative;
                    lowest_dexterity = dexterity;
                    lowest_index = i;
                }
            }
            $ordered_records.unshift($records.splice(lowest_index, 1))
            lowest_initiative = 99999;
            lowest_dexterity = 99999;
            lowest_index = 0;
        }

        $initiative_records.empty();
        for (var i = 0; i < $ordered_records.length; i++) {
            $initiative_records.append($ordered_records[i]);
        }
    }

    $("#create_initiative_record").click(function() {
        var name = $("#initiative-tracker .name-input").val();
        var initiative = $("#initiative-tracker .initiative-input").val();
        var dexterity = $("#initiative-tracker .dexterity-input").val();
        if (name == "") {
            return
        }
        if (initiative == "") {
            initiative = 0;
        }
        if (dexterity == "") {
            dexterity = 0;
        }

        $new_record = create_initiative_record(name, initiative, dexterity);

        $initiative_records.append($new_record);
        order_initiative_records();

        $("#initiative-tracker .name-input").val("");
        $("#initiative-tracker .initiative-input").val("");
        $("#initiative-tracker .dexterity-input").val("");

        $("#initiative-tracker .name-input").focus()
    });

    $("#delete_all_initiative_records").click(function() {
        $initiative_records.empty();
    });

    $("#initiative-tracker").on("click",".disable_initiative_record", function() {
        $tr = $(this).closest("tr");
        $tr.addClass("disabled");
        $tr.removeClass("enabled");

        $(this).closest("td").remove();
        $tr.append($disabled_records_buttons.clone());
    });

    $("#initiative-tracker").on("click",".enable_initiative_record", function() {
        $tr = $(this).closest("tr");
        $tr.addClass("enabled");
        $tr.removeClass("disabled");

        $(this).closest("td").remove();
        $tr.append($enabled_records_buttons.clone());
    });

    $("#initiative-tracker").on("click",".delete_initiative_record", function() {
        $tr = $(this).closest("tr");
        $tr.remove()
    });

    //=======================================
    // Timer & History
    //=======================================
    // Timer
    $timer_time = $("#timer #clock");
    $start_button = $("#stop_watch_start");
    $pause_button = $("#stop_watch_pause");
    $stop_button = $("#stop_watch_stop");
    $next_player_button = $("#stop_watch_next_player");

    $pause_button.prop("disabled", true);
    $stop_button.prop("disabled", true);
    $next_player_button.prop("disabled", true);

    // History
    $history_records = $("#history tbody");

    var timer_interval;
    var previous_time = "";
    var time_elapsed = 0;
    var time = 0;
    var paused = false;

    $start_button.click(function() {
        if (paused) {
            paused = false;
        }
        else {
            previous_time = new Date().getTime();
            time_elapsed = 0;
            timer_interval = setInterval(stop_watch_process, 1);
            highlight_first_initiative_record();
            $history_records.empty();
        }

        $start_button.prop("disabled", true);
        $pause_button.prop("disabled", false);
        $stop_button.prop("disabled", false);
        $next_player_button.prop("disabled", false);
    });

    $stop_button.click(function() {
        clearInterval(timer_interval);

        $start_button.prop("disabled", false);
        $pause_button.prop("disabled", true);
        $stop_button.prop("disabled", true);
        $next_player_button.prop("disabled", true);

        paused = false;

        unhighlight_initiative_records();
    });

    $pause_button.click(function() {
        paused = true;

        $start_button.prop("disabled", false);
        $pause_button.prop("disabled", true);
        $stop_button.prop("disabled", false);
        $next_player_button.prop("disabled", true);
    });


    function stop_watch_process() {
        var current_time = new Date().getTime();
        var diff = (current_time - previous_time);
        previous_time += diff;
        if (!paused) {
            time_elapsed += diff;
        }

        $timer_time.text(format_time(time_elapsed));
    }

    function format_time(ms) {
        var hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((ms % (1000 * 60)) / 1000);
        var milliseconds = Math.floor(ms % 1000);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        milliseconds = (milliseconds < 100) ? (milliseconds < 10) ? "00" + milliseconds : "0" + milliseconds : milliseconds;

        return hours + ":" + minutes + ":" + seconds + "." + milliseconds
    }

    // History
    $next_player_button.click(function() {
        var name = get_highlighted_initiative_record_name();
        highlight_next_initiative_record();
        if (name == "") {
            return
        }

        $new_record = create_history_record(name, format_time(time_elapsed));
        $history_records.prepend($new_record);
    });

    function create_history_record(name, time) {
        $new_row = $("<tr>");
        $new_row.append($("<td>").text(name));
        $new_row.append($("<td>").text(time));
        return $new_row
    }
});
