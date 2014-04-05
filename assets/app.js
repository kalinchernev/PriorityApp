(function($, window, document) {
    
//if($.jStorage.storageAvailable()){
//    $(".messages").addClass("bg-success").html("Storage is available");
//}

displayItems();

$("#add-item").on("click", addItem);
$(".delete-item").on("click", deleteItem);
$("#freeze-form").on("click", freezeForm);
$("#reset").on("click", resetAll);
$("#showAbout").on("click", showAbout);
$(".list-item").bind(makeEditable);
$(".list-item").bind({
  dblclick: makeEditable,
  blur: editItem
});
    
}(window.jQuery, window, document));

/**
 * Add new item to the list
 * @param {object} event 
 *  Default click event is prevented. 
 * @returns {void}
 */
function addItem(event) {
    event.preventDefault();
    
    var item;
    
    item = $("#priorityInput").val();
    if ( item.length > 0 ) {
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
//    $(this).blur().prop("contentEditable", "false");
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
    var items, item, newItem, priorities = [];
    
    items = getAll();
    
    if ( items !== null ) {
        items.sort();

        for (var i = 0; i < items.length; i++ ) {
            item = $.jStorage.get(parseInt(items[i]));
            newItem = "<div class='list-item' data-item-key='" + parseInt(items[i]) + "'>"
                    + item + 
                    "<a href='#' class='delete-item glyphicon glyphicon-remove pull-right'></a>" +
                    "<div>";
            priorities.push(newItem);
        }

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
    var list = $.jStorage.index();
    if ( list.length > 0 ) {
        return list;        
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
        list.sort();
        lastKeyElement = parseInt(list.length - 1);
        lastKey = parseInt(list[lastKeyElement]);
        return lastKey + 1;
    }
}

//Functions documentation: http://www.jstorage.info/#reference