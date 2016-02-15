import {IAstPatternDispatcher} from "./dispatcher"
import {AstNode, NIL} from "./ast"
import * as _ from "lodash"

export interface IOutlineNode {
    name: string
    node: AstNode
    children: IOutlineNode[]
}

export const EMPTY_OUTLINE:IOutlineNode = {
    name:     "",
    node:     NIL,
    children: []
}

Object.freeze(EMPTY_OUTLINE)

/**
 * returns the name in an outline of a
 */
export interface IOutlineDispatcher extends IAstPatternDispatcher<void, string> {}

/**
 * to explicitly say what you mean...
 */
export const NO_OUTLINE_FOR_NODE:string = undefined

export function buildOutline(astNode:AstNode, dispatcher:IOutlineDispatcher):IOutlineNode {

    let name = dispatcher.dispatch(astNode)

    if (name === NO_OUTLINE_FOR_NODE) {
        return EMPTY_OUTLINE
    }

    let children = _.map(astNode.children(), (astChild) => buildOutline(astChild, dispatcher))

    children = _.filter(children, (currchild) => currchild !== EMPTY_OUTLINE)

    let outlineNode:IOutlineNode = {
        name:     name,
        node:     astNode,
        children: children
    }

    return outlineNode
}

export type Comparator = (first:IOutlineNode, second:IOutlineNode) => number

export function compareAlphabetically(first:IOutlineNode, second:IOutlineNode):number {
    return first.name.toLocaleLowerCase().localeCompare(second.name.toLocaleLowerCase())
}

export function compareByPosition(first:IOutlineNode, second:IOutlineNode):number {
    // TODO: implement
    return null
}

/**
 *  side effect!
 *  modifies the unsortedOutline in place.
 */
export function sortOutline(unsortedOutline:IOutlineNode,
                            comparator:Comparator):IOutlineNode {

    _.forEach(unsortedOutline.children, (currChild) => {
        sortOutline(currChild, comparator)
    })

    unsortedOutline.children.sort(comparator)

    // has been modified
    return unsortedOutline
}
