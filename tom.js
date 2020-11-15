$(function() {
    //=======================================
    // Initiative Tracker
    //=======================================

    // Enabled records buttons
    $enabled_records_buttons = $("<td>")
        .append($("<input>").attr({"type":"button","value":"Disable"}).addClass("disable_initiative_record"))

    // Disabled records buttons
    $disabled_records_buttons = $("<td>")
        .append($("<input>").attr({"type":"button","value":"Enable"}).addClass("enable_initiative_record"))
        .append($("<input>").attr({"type":"button","value":"Delete"}).addClass("delete_initiative_record"))

    // Get existing records
    $initiative_records = $("#initiative-tracker tbody");

    // Create a new record
    function create_initiative_record(name, initiative, dexterity) {
        $new_row = $("<tr>");
        $new_row.append($("<td>").text(name));
        $new_row.append($("<td>").text(initiative));
        $new_row.append($("<td>").text(dexterity));
        $new_row.append($enabled_records_buttons.clone())
        return $new_row
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
        if (name == "" || initiative == "" || dexterity == "") {
            return
        }
        $new_record = create_initiative_record(name, initiative, dexterity);

        $initiative_records.append($new_record);
        order_initiative_records();

        $("#initiative-tracker .name-input").val("");
        $("#initiative-tracker .initiative-input").val("");
        $("#initiative-tracker .dexterity-input").val("");
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
});