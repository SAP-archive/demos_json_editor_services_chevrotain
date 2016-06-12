import {
    AstNode,
    NIL,
    setParent
} from "../../pudu/ast"
import {Token} from "chevrotain"

export class StyleSheet extends AstNode {

    constructor(private _charsetHeader:CharsetHeader = NIL,
                private _imports:CssImport[] = [],
                private _contents:Contents[] = [],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get charsetHeader():CharsetHeader {
        return this._charsetHeader
    }

    get imports():CssImport[] {
        return this._imports
    }

    get contents():Contents[] {
        return this._contents
    }
}

export class CharsetHeader extends AstNode {

    // TODO: StringLiteral instead of String?
    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get value():string {
        return this._value
    }
}

export abstract class Contents extends AstNode {
    constructor(_parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }
}

export class CssImport extends AstNode {

    constructor(private _target:string,
                private _mediaList:CssMediaList = NIL,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get target():string {
        return this._target
    }

    get mediaList():CssMediaList {
        return this._mediaList
    }
}

export class Media extends Contents {

    constructor(private _mediaList:CssMediaList,
                private _ruleSet:RuleSet,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get mediaList():CssMediaList {
        return this._mediaList
    }

    get ruleSet():RuleSet {
        return this._ruleSet
    }
}

export class CssMediaList extends AstNode {

    constructor(private _mediums:Identifier[] = [],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get mediums():Identifier[] {
        return this._mediums
    }
}

export class Page extends Contents {

    constructor(private _pseudoPage:PseudoPage = NIL,
                private _declarationsGroup:DeclarationsGroup,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get pseudoPage():PseudoPage {
        return this._pseudoPage
    }

    get declarationsGroup():DeclarationsGroup {
        return this._declarationsGroup
    }
}

export class DeclarationsGroup extends AstNode {

    constructor(private _declarations:Declaration[] = [],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get declarations():Declaration[] {
        return this._declarations
    }
}

export class PseudoPage extends AstNode {

    constructor(private _name:Identifier,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get name():Identifier {
        return this._name
    }
}

export class RuleSet extends Contents {

    constructor(private _selectors:Selector[] = [],
                private _declarationsGroup:DeclarationsGroup,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get selectors():Selector[] {
        return this._selectors
    }

    get declarationsGroup():DeclarationsGroup {
        return this._declarationsGroup
    }
}

export class Selector extends AstNode {

    constructor(private _simpleSelector:SimpleSelector,
                private _combinator:Combinator = NIL,
                private _nextSelector:Selector = NIL,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get simpleSelector():SimpleSelector {
        return this._simpleSelector
    }

    get combinator():Combinator {
        return this._combinator
    }

    get nextSelector():Selector {
        return this._nextSelector
    }
}

export enum COMBINATOR_TYPE {PLUS, GREATHER_THEN}

export abstract class Combinator extends AstNode {
    constructor(private _type:COMBINATOR_TYPE,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get type():COMBINATOR_TYPE {
        return this._type
    }
}

export class SimpleSelector extends AstNode {

    constructor(private _elementName:ElementName = NIL,
                private _suffixes:SimpleSelectorSuffix[] = [],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get elementName():ElementName {
        return this._elementName
    }

    get suffixes():SimpleSelectorSuffix[] {
        return this._suffixes
    }
}

export abstract class SimpleSelectorSuffix extends AstNode {
    constructor(_parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }
}

export class Hash extends SimpleSelectorSuffix {
    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get value():string {
        return this._value
    }
}

export class ClassSelector extends SimpleSelectorSuffix {

    constructor(private _selectedclassName:Identifier,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get selectedclassName():Identifier {
        return this._selectedclassName
    }
}

export class ElementName extends AstNode {

    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get value():string {
        return this._value
    }
}

export enum ATTRIB_RELATION {NONE, EQUALS, INCLUDES, BEGINS}

export class Attrib extends SimpleSelectorSuffix {

    constructor(private _key:string,
                private _relation:ATTRIB_RELATION = ATTRIB_RELATION.NONE,
                // TODO: should this be undefined? empty string? what?
                // maybe an OPTIONAL pattern is needed
                private _value:string = "",
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
        setParent(this)
    }

    get key():string {
        return this._key
    }

    get relation():ATTRIB_RELATION {
        return this._relation
    }

    get value():string {
        return this._value
    }
}

export abstract class Pseudo extends SimpleSelectorSuffix {
    constructor(_parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }
}

export class PseudoIdent extends Pseudo {
    constructor(private _name:Identifier,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():Identifier {
        return this._name
    }
}

export class PseudoFunc extends Pseudo {
    constructor(private _name:Identifier = NIL,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get argument():Identifier {
        return this._name
    }
}

export class Declaration extends AstNode {
    constructor(private _property:string,
                private _expr:Expr,
                private _isImportant:boolean = false,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get property():string {
        return this._property
    }

    get expr():Expr {
        return this._expr
    }

    get isImportant():boolean {
        return this._isImportant
    }
}

export enum BINARY_OPERATOR_TYPE {SLASH, COMMA}

export class BinaryOperator extends Value {
    constructor(private _value:string,
                private _type:BINARY_OPERATOR_TYPE,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }

    get type():BINARY_OPERATOR_TYPE {
        return this._type
    }
}

export class Expr extends AstNode {
    constructor(private _operands:Term[],
                private _operators:BinaryOperator[],
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get operands():Term[] {
        return this._operands
    }

    get operators():BinaryOperator[] {
        return this._operators
    }
}

// currently avoiding copy/paste mania by using this num to distinguish between different
// kinds of unary operators in terms.
export enum UNARY_OPERATOR {PLUS, MINUS}

export class UnaryOperator extends Value {
    constructor(private _value:string,
                private _type:UNARY_OPERATOR,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }

    get type():UNARY_OPERATOR {
        return this._type
    }
}

export class Term extends AstNode {
    constructor(private _unaryOperator:UnaryOperator = NIL,
                private _value:Value,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get unaryOperator():UnaryOperator {
        return this._unaryOperator
    }

    get value():Value {
        return this._value
    }
}

export abstract class Value extends AstNode {
    constructor(_parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }
}

// currently avoiding copy/paste mania by using this num to distinguish between different
// kinds of NumericalTypes
export enum NUMERICAL_TYPE {EMS, EXS, PX, CM, MM, IN, PT, PC, DEG, RAD, GRAD, MS, SEC, HZ, KHZ, PERCENTAGE, NUM }

export class NumericalLiteral extends Value {
    constructor(private _value:string,
                private _type:NUMERICAL_TYPE,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }

    get type():NUMERICAL_TYPE {
        return this._type
    }
}

export class StringLiteral extends Value {
    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }
}

export class Identifier extends Value {
    constructor(private _name:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get name():string {
        return this._name
    }
}

export class CssUri extends Value {
    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }
}

export class CssFunction extends Value {
    constructor(private _argument:Expr,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get argument():Expr {
        return this._argument
    }
}

export class Hexcolor extends Value {
    constructor(private _value:string,
                _parent:AstNode = NIL,
                _syntaxBox:Token[] = []) {
        super(_parent, _syntaxBox)
    }

    get value():string {
        return this._value
    }
}
