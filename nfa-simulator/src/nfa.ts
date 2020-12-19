type State = string;
type InputSymbol = string;

export interface NFADescription {
    transitions: {
        [key: string]: {
            lambda?: State[],
            0?: State[],
            1?: State[]
        }
    },
    start: State,
    acceptStates: State[]
}

export default class NonDeterministicFiniteStateMachine {
    private description: NFADescription;

    constructor(description: NFADescription) {
        this.description = description;
    }

    transition(state: State, symbol: InputSymbol): State[] {
        const {
            description: { transitions },
        } = this;

        return (transitions[state] && transitions[state][symbol]) ? transitions[state][symbol] : [];
    }
    
    accepts(s: string, states = [this.description.start]) {
        const { 
            description: { acceptStates },
        } = this;

        states = [...states, ...states.flatMap(state => this.transition(state, 'lambda'))]
        const nextStates = [...states.flatMap(state => this.transition(state, s.charAt(0)))]

        return (s.length === 0) ? acceptStates.some(state => states.includes(state)) : this.accepts(s.substr(1), nextStates)
    }

}