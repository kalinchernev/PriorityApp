(function($, window, document) {
    
//if($.jStorage.storageAvailable()){
//    $(".messages").addClass("bg-success").html("Storage is available");
//}

displayItems();

$("#add-item").on("click", addItem);
$(".delete-item").on("click", deleteItem);
$("#freeze-form").on("click", freezeForm);
$("#freeze-round").bind({
    click: function(e) {
        e.preventDefault();
        alert("freeze the round!");
    }
});
$("#reset").on("click", resetAll);
$("#showAbout").on("click", showAbout);
$(".list-item").bind(makeEditable);
$(".list-item").bind({
  dblclick: makeEditable,
  blur: editItem
});

$( "#sortable-list" ).sortable({ cursor: "pointer" });
$( "#sortable-list" ).disableSelection();
    
}(window.jQuery, window, document));

/**
 * Add new item to the list
 * @param {object} event 
 *  Default click event is prevented. 
 * @returns {void}
 */
function addItem(event) {
    event.preventDefault();
    
    var item, itemValue, itemWeigth, itemLocked;
    
    itemValue = $("#priorityInput").val();
    itemWeigth = nextWeigth();
    itemLocked = false;
    
    item = {
        itemValue: itemValue,
        itemWeight: itemWeigth,
        itemLocked: itemLocked
    };
    
    if ( itemValue.length > 0 ) {
        $.jStorage.set(nextKey(), item);
        destroyItems();
        displayItems();
    } else {
        $('#missing-value').modal();
    }
}

/**
 * Makes a list item editable
 * @returns {void}
 */
function makeEditable() {
    $(this).prop("contentEditable", "true");
}

/**
 * Updates a given item
 * @returns {void}
 */
function editItem() {
    var key, value;
    
    key = $(this).data("itemKey");
    value = $(this).text();
    
    $.jStorage.set(key, value);
}

/**
 * Deletes a given item
 * @returns {void}
 */
function deleteItem(e) {
    e.preventDefault();
    var key = $(this).parent().data("itemKey");
    $.jStorage.deleteKey(key);
    $(".list-items").find("[data-item-key='" + key + "']").remove();
    location.reload();
}

/**
 * Removes old items from the DOM
 * @returns {void}
 */
function destroyItems() {
    var oldItems;
    
    oldItems = $(".list-items").children();
    oldItems.remove();
}

/**
 * Displays the items in the DOM
 * @returns {void}
 */
function displayItems(){
    var items, newItem, priorities = [];
    
    items = getAll();
    
    if ( items !== null ) {

    $.each(items, function(index, object) {
        newItem = "<li class='list-item' data-locked='" 
        + object.itemLocked + "' data-weigth='" 
        + object.itemWeight + "' data-item-key='" 
        + index 
        + "'>" 
        + object.itemValue 
        + "<a href='#' class='delete-item glyphicon glyphicon-remove pull-right'></li>";
        priorities.push(newItem);        
    });

    $(".list-items").append(priorities);        
    
    }
    return;
}

/**
 * Query all items
 * @returns {array} list
 * List of currently available keys
 */
function getAll() {
    var list, key, listJSON = {};
    var value = {};
    
    list = $.jStorage.index();
    for ( var i = 0; i < list.length; i++ ) {
        key = parseInt(list[i]);
        value = $.jStorage.get(key);
        listJSON[i] = value;
    }
    if ( list.length > 0 ) {
        return listJSON;        
    } else {
        return null;
    }
}

/**
 * Freezes the input of the form
 * @returns {void}
 */
function freezeForm(e) {
    e.preventDefault();
    $("#priorityInput").prop('disabled', true);;
}

/**
 * Removes all list items and enables the form.
 * @returns {void}
 */
function resetAll(e) {
    e.preventDefault();
    $.jStorage.flush();
    location.reload();
}

/**
 * Displays a modal with information about the project.
 * @returns {void}
 */
function showAbout() {
    $('#aboutPage').modal();
}

/**
 * The key incremented for new item input
 * @returns {integer} nextKey
 *  The incremented key for new value.
 */
function nextKey() {
    var list, lastKeyElement, lastKey;
    
    list = getAll();
    if ( list === null ) {
        return 0;
    } else {
//        list.sort();
        lastKeyElement = parseInt(list.length - 1);
        lastKey = parseInt(list[lastKeyElement]);
        return lastKey + 1;
    }
}

/**
 * The weight property incremented for new item inputs
 * @returns {integer} nextWeigth
 *  The incremented value.
 */
function nextWeigth() {
    var list, lastWeigthElement, nextWeigth;
    
    list = getAll();
    console.log(list);
    
    nextWeigth = 0;
    return nextWeigth;
//    if ( list === null ) {
//        return 0;
//    } else {
//        list.sort();
//        lastKeyElement = parseInt(list.length - 1);
//        lastKey = parseInt(list[lastKeyElement]);
//        return lastKey + 1;
//    }
}