/*
Expects allItems to be an array of objects.
Each object must contain keys id and parentItem.
Key parentItem value must be null or else an object with a single key - that single key is id
ie. parentItem = {id: x}

Returns a nested tree array. Example:
Array[3]
    0 : Object
        id : 1
    1 : Array[3]
        0 : Object
            id : 2
        1 : Array[1]
            0 : Object
                id : 5
        2 : Object
            id : 4
    2 : Object
        id : 3
*/
var ParseTree = function(options) {

    var allItems = options.allItems;
    var setFieldsFn = options.setFieldsFunction;
    var parentItemKey = options.parentItemKey || 'parentItem'; 

    var child_parents = {};
    for(var i =0; i<allItems.length; i++)
    {
        var item = allItems[i];
        child_parents[item.id] = item[parentItemKey] === null || item[parentItemKey] == 'undefined' ? null : item[parentItemKey].id;
    }


    var parse = function($tree, $root = null, $markup_fn = null) {
        var $return = [];
        // Traverse the tree and search for direct children of the root
        for(var $child in $tree) {
            var $parent = $tree[$child];
            // A direct child is found
            if ($parent == $root) {
                // Remove item from tree (we don't need to traverse this again)
                delete $tree[$child];

                // Append the child into result array and parse its children
                // Pass it through markup function if available
                if($markup_fn)
                {
                    var allItemsLength = allItems.length;
                    for(var i =0; i< allItemsLength; i++) {
                        var item = allItems[i];
                        if (item.id == $child) {
                            $return.push($markup_fn(item));
                            break;
                        }
                     }
                }
                else
                {
                    $return.push($child);
                }
                
                var $children = parse($tree, $child, $markup_fn);
                if ($children)
                    $return.push($children);
            }
        }
        return $return.length ? $return : null;
    };
    
    return parse(child_parents, null, setFieldsFn) || [];
};

module.exports = ParseTree;