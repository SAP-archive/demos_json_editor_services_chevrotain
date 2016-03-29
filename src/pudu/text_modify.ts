export class ITextModification {
    constructor(public offset:number) {}
}

// TODO: should replace be differentiated from replace
// TODO: when does the order of replacements matter? and what to do if it matters?

// - Deletion inside range that has "Add"
//   can this happen? add is not on range, it is in specific offset
//   so this means that this use case is identical to "Adding inside range which has Delete"
//
// - Deletion inside "untouched" area, change offset for modifications in the "following" text with -length
export class TextDelete extends ITextModification {
    constructor(offset:number, public length:number) {super(offset)}
}

// - Adding inside range which has Delete --> Delete split into two separate deletes
// - Adding in "untouched" range --> changes the "following" text offsets are modified with length of addition
export class TextInsert extends ITextModification {
    constructor(offset:number, public newText:string) {super(offset)}
}


export class TextReplace extends ITextModification {
    constructor(offset:number, public length:number, public newText:string) {super(offset)}
}

// IF we perform the operation in reverse order we don't have to modify the offsets at all!

/**
 * Performs a series of modifications on an input text.
 * with each change is defined in terms of a change on the original text.
 */
export function modifyText(text:string, modifications:ITextModification[]):string {

    // replace should be converted into two separate modifications, delete and add.
    let withoutReplace = transformTextReplace(modifications)
    // Insert in a deleted range should be transformed into two separate deletes so the insert is no longer
    // inside any delete range.
    let withoutInsertInDelete = fixInsertInDelete(withoutReplace)
    // perform the textChanges from the "edge/end" of the text makes it much simpler
    // as it does not affect any other modifications in "earlier" parts of the text.
    // (as long as there is no range overlap for the modifications)
    let sortedInReverseOrder = sortByDecendingOffset(withoutInsertInDelete)

    let deletions = _.filter(sortedInReverseOrder, (currTextMod) => currTextMod instanceof TextDelete)
    let insertions = _.filter(sortedInReverseOrder, (currTextMod) => currTextMod instanceof TextInsert)

    let modifiedText = text
    // 1. must delete before insert as:
    //    * all changes are described as changes to the original text.
    //    * an insert may be in a range of deletes, so in that case inserting before the deletion
    //      will mean canceling part of the insertion which is not what the author meant.
    //  TODO: so does this mean we can undo some parts of deletes!?
    _.forEach(reversedOrderOfInserts, (currMod) => {

        if (currMod instanceof TextDelete) {
            let start = currMod.offset
            let end = currMod.offset + currMod.length
            modifiedText = replaceRange(modifiedText, start, end, "")
        }
        else if (currMod instanceof TextInsert) {
            let start = currMod.offset
            let newText = currMod.newText
            let end = currMod.offset + newText.length
            modifiedText = replaceRange(modifiedText, start, end, newText)
        }
        // don't need to handle TextReplace here as we transformed Replace into Insert + Delete
        else {
            throw Error("None exhaustive match, unknown type of TextModification")
        }
    })


    return modifiedText
}

export function replaceRange(target:string,
                             startOffset:number,
                             endOffset:number,
                             newContents:string):string {
    return target.substring(0, startOffset) + newContents + target.substring(endOffset)
}

/**
 *
 * Transform textReplace into textDelete + textInsert
 */
export function transformTextReplace(mods:ITextModification[]):ITextModification[] {
    return _.reduce(mods, (result, currMod) => {
        if (currMod instanceof TextReplace) {
            result.push(new TextDelete(currMod.offset, currMod.length))
            result.push(new TextInsert(currMod.offset, currMod.newText))
        }
        else {
            result.push(currMod)
        }
        return result
    }, [])
}

// TODO: check edge cases
export function fixInsertInDelete(mods:ITextModification[]):ITextModification[] {
    return _.reduce(mods, (result, currMod) => {

        if (currMod instanceof TextDelete) {
            let deleteOffset = currMod.offset
            let deleteLength = currMod.length

            let insertInDelete = _.find(mods, (currInsertMod) => {

                if (currInsertMod instanceof TextInsert) {
                    let insertOffset = currInsertMod.offset
                    return insertOffset > deleteOffset &&
                        insertOffset < deleteOffset + deleteLength
                }
                else {
                    return false
                }

            })

            if (insertInDelete) {
                let insertOffset = insertInDelete.offset
                let insertLength = insertInDelete.newText.length

                result.push(new TextDelete(deleteOffset, insertOffset - deleteOffset))
                result.push(new TextDelete(insertOffset + insertLength, deleteOffset + deleteLength))
            }
            else {
                result.push(currMod)
            }
        }
        else {
            result.push(currMod)
        }
        return result
    }, [])
}

export function sortByDecendingOffset(mods:ITextModification[]):ITextModification[] {
    let inAscending = _.sortBy(mods, (currMod) => currMod.offset)
    return _.reverse(inAscending)
}

export function orderDeletesBeforeInsertsForSameOffset(mods:ITextModification[]):ITextModification[] {

}

export function reverseOrderOfInserts(mods:ITextModification[]):ITextModification[] {

    let curSequence = []
    return _.reduce(mods, (result, currMod, idx, col) => {
        let isNotLastItem = idx !== col.length - 1

        if (isNotLastItem) {

        }
        else {

        }


        if (currMod instanceof TextInsert &&
            col[idx + 1].offset === currMod.offset) {


        }
        else {
            result.push(currMod)
        }
        return result
    }, [])
}


// 20 15 12 7^ 7^^ 7^^^-
// 123xxx456 --> 2yyy6
// delete : offset 1 length 7
// insert : offset 3 text "yyy"
