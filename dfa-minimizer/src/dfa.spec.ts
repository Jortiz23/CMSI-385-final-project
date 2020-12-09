import test from 'ava';

import DeterministicFiniteStateMachine, { DFADescription } from './dfa';

const machineTests: {
    [name: string]: {
        description: DFADescription;
        accepted: string[];
        rejected: string[];
        initialEquivalenceClass: string[][];
        minimizedEquivalenceClass: string[][],
        initialStateBehavior: string[],
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
        minimizedEquivalenceClass: [['S'], ['A'], ['B']],
        initialStateBehavior: ['01', '00', '11'],
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
        minimizedEquivalenceClass: [['r0'], ['r1'], ['r2']],
        initialStateBehavior: ['01', '10', '11'],
    },
    startsWith010Unminimized: {
        description: {
            transitions: {
                A: {
                    0: 'B',
                    1: 'C',
                },
                B: {
                    0: 'C',
                    1: 'D',
                },
                C: {
                    0: 'C',
                    1: 'C',
                },
                D: {
                    0: 'F',
                    1: 'E',
                },
                E: {
                    0: 'E',
                    1: 'E',
                },
                F: {
                    0: 'F',
                    1: 'F',
                },
            },
            start: 'A',
            acceptStates: ['F'],
        },
        accepted: ['010', '01010010', '01000100', '01011111'],
        rejected: ['', '1', '011', '1111111'],
        initialEquivalenceClass: [['F'], ['A', 'B', 'C', 'D', 'E']],
        minimizedEquivalenceClass: [['A'], ['B'], ['C', 'E'], ['D'], ['F']],
        initialStateBehavior: ['11', '11', '11', '01', '11', '00'],
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
    test(`${name}/initialEquivClass`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { initialEquivalenceClass } = testDescription;
        t.assert(JSON.stringify(initialEquivalenceClass) === JSON.stringify(dfa.initialEquivalenceClass()));
    });
    test(`${name}/findStateBehavior`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { initialEquivalenceClass, initialStateBehavior } = testDescription;
        const { transitions, } = testDescription.description;
        let count = 0;
        for (const [, stateTransitions] of Object.entries(transitions)) {
            t.assert(initialStateBehavior[count] === dfa.findStateBehavior(initialEquivalenceClass, stateTransitions));
            count++;
        }
    });
    test(`${name}/minimize`, (t) => {
        const dfa = new DeterministicFiniteStateMachine(
            testDescription.description
        );
        const { minimizedEquivalenceClass } = testDescription;
        console.log(minimizedEquivalenceClass);
        console.log(dfa.minimize());
        t.assert(JSON.stringify(minimizedEquivalenceClass) === JSON.stringify(dfa.minimize()));
    });
}
