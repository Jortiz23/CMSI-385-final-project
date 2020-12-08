import test from 'ava';

import DeterministicFiniteStateMachine, { DFADescription } from './dfa';

const machineTests: {
    [name: string]: {
        description: DFADescription;
        accepted: string[];
        rejected: string[];
        initialEquivalenceClass: string[][];
    };
} = {
    startsWith0: {
        description: {
            transitions: {
                S: {
                    0: 'A',
                    1: 'B',
                },
                A: {
                    0: 'A',
                    1: 'A',
                },
                B: {
                    0: 'B',
                    1: 'B',
                },
            },
            start: 'S',
            acceptStates: ['A'],
        },
        accepted: ['0', '01', '00000', '0111111'],
        rejected: ['', '10', '10001010', '111111', '101111'],
        initialEquivalenceClass: [['A'], ['S', 'B']],
    },
    divisibleBy3: {
        description: {
            transitions: {
                r0: {
                    0: 'r0',
                    1: 'r1',
                },
                r1: {
                    0: 'r2',
                    1: 'r0',
                },
                r2: {
                    0: 'r1',
                    1: 'r2',
                },
            },
            start: 'r0',
            acceptStates: ['r0'],
        },
        accepted: ['', '0', '11', '00000', '110000', '101111111101'],
        rejected: ['10', '1010', '100000', '1011111'],
        initialEquivalenceClass: [['r0'], ['r1', 'r2']],
    },
};

for (const [name, testDescription] of Object.entries(machineTests)) {
    test(`${name}/constructor`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        t.truthy(dfa);
    });
    test(`${name}/transition`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { transitions } = testDescription.description;
        for (const [state, stateTransitions] of Object.entries(transitions)) {
            for (const [symbol, nextState] of Object.entries(
                stateTransitions
            )) {
                t.assert(nextState === dfa.transition(state, symbol));
            }
        }
    });
    test(`${name}/accepts`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { accepted, rejected } = testDescription;
        for (const s of accepted) {
            t.assert(dfa.accepts(s));
        }
        for (const s of rejected) {
            t.assert(!dfa.accepts(s));
        }
    });
    test(`${name}/initEquivalenceClass`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { initialEquivalenceClass } = testDescription;
        console.log(dfa.initEquivClass());
        t.assert(initialEquivalenceClass == dfa.initEquivClass());
    });
}
