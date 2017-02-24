/*
Expects allItems to be an array of objects.
Each object must contain keys id and parentId.

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
var ParseTree = function(allItems, setFieldsFn) {

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
                $return.push($markup_fn ? $markup_fn($child) : $child);
                var $children = parse($tree, $child, $markup_fn);
                if ($children)
                    $return.push($children);
            }
        }
        return $return.length ? $return : null;
    };

    var child_parents = {};
    for(var i =0; i<allItems.length; i++)
    {
        var item = allItems[i];
        child_parents[item.id] = item.parentId === null ? null : item.parentId;
    }
    
    return parse(child_parents, null, setFieldsFn);
};

module.exports = ParseTree;