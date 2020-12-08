type State = string;
type InputSymbol = string;

export interface DFADescription {
    transitions: {
        [key: string]: {
            0: State;
            1: State;
        };
    };
    start: State;
    acceptStates: State[];
}

export default class DeterministicFiniteStateMachine {
    private description: DFADescription;

    constructor(description: DFADescription) {
        this.description = description;
    }

    transition(state: State, symbol: InputSymbol): State {
        const {
            description: { transitions },
        } = this;
        return transitions[state][symbol];
    }

    accepts(s: string): boolean {
        const {
            description: { start, acceptStates },
        } = this;

        let state = start;

        for (const symbol of s) {
            state = this.transition(state, symbol);
        }

        return acceptStates.includes(state);
    }

    minimize(): DeterministicFiniteStateMachine {
        const {
            description: { transitions },
        } = this;

        const equivalenceClass = this.initEquivClass();
        equivalenceClass;

        for (const [state, stateTransitions] of Object.entries(transitions)) {
            state;
            stateTransitions;
        }

        return this;
    }

    initEquivClass(): State[][] {
        const {
            description: { transitions, acceptStates },
        } = this;

        const initialEquivalenceClass: State[][] = [[], []];

        initialEquivalenceClass[0] = acceptStates;

        for (const state in transitions) {
            if (!acceptStates.includes(state)) {
                initialEquivalenceClass[1].push(state);
            }
        }

        return initialEquivalenceClass;
    }
}
