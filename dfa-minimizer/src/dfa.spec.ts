import test from 'ava';

import DeterministicFiniteStateMachine, { DFADescription } from './dfa';

const machineTests: {
    [name: string]: {
        description: DFADescription;
        accepted: string[];
        rejected: string[];
        initialEquivalenceClass: string[][];
        minimizedEquivalenceClass: string[][];
        initialStateBehavior: string[];
        minimizedDescription: DFADescription;
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
        minimizedDescription: {
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
        minimizedDescription: {
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
        minimizedDescription: {
            transitions: {
                A: {
                    0: 'B',
                    1: 'CE',
                },
                B: {
                    0: 'CE',
                    1: 'D',
                },
                CE: {
                    0: 'CE',
                    1: 'CE',
                },
                D: {
                    0: 'F',
                    1: 'CE',
                },
                F: {
                    0: 'F',
                    1: 'F',
                },
            },
            start: 'A',
            acceptStates: ['F'],
        },
    },
    startsWith0OnlyUnminimized: { // Quiz 2 question 1
        description: {
            transitions: {
                A: {
                    0: 'E',
                    1: 'M',
                },
                E: {
                    0: 'N',
                    1: 'G',
                },
                G: {
                    0: 'K',
                    1: 'G',
                },
                K: {
                    0: 'M',
                    1: 'N',
                },
                N: {
                    0: 'K',
                    1: 'M',
                },
                M: {
                    0: 'M',
                    1: 'K',
                },
            },
            start: 'A',
            acceptStates: ['E', 'G'],
        },
        accepted: ['0', '01', '01111', '0111111'],
        rejected: ['', '1', '010', '01111110', '101'],
        initialEquivalenceClass: [['E', 'G'], ['A', 'K', 'N', 'M']],
        minimizedEquivalenceClass: [['A'], ['E', 'G'], ['K', 'N', 'M']],
        initialStateBehavior: ['01', '10', '10', '11', '11', '11'],
        minimizedDescription: {
            transitions: {
                A: {
                    0: 'EG',
                    1: 'KNM',
                },
                EG: {
                    0: 'KNM',
                    1: 'EG',
                },
                KNM: {
                    0: 'KNM',
                    1: 'KNM',
                },
            },
            start: 'A',
            acceptStates: ['EG'],
        },
    },
    noConsecutive1sUnminimized: { // Quiz 2 question 2
        description: {
            transitions: {
                A: {
                    0: 'E',
                    1: 'G',
                },
                E: {
                    0: 'A',
                    1: 'G',
                },
                G: {
                    0: 'A',
                    1: 'K',
                },
                K: {
                    0: 'M',
                    1: 'M',
                },
                M: {
                    0: 'M',
                    1: 'K',
                },
            },
            start: 'A',
            acceptStates: ['A', 'E', 'G'],
        },
        accepted: ['', '0', '1', '0100010', '101010101'],
        rejected: ['11', '0100110010', '011111', '0101101'],
        initialEquivalenceClass: [['A', 'E', 'G'], ['K', 'M']],
        minimizedEquivalenceClass: [['A', 'E'], ['G'], ['K', 'M']],
        initialStateBehavior: ['00', '00', '01', '11', '11'],
        minimizedDescription: {
            transitions: {
                AE: {
                    0: 'AE',
                    1: 'G',
                },
                G: {
                    0: 'AE',
                    1: 'KM',
                },
                KM: {
                    0: 'KM',
                    1: 'KM',
                },
            },
            start: 'AE',
            acceptStates: ['AE', 'G'],
        },
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
        const minimizeddfa = new DeterministicFiniteStateMachine(
            testDescription.minimizedDescription
        )
        t.assert(JSON.stringify(minimizeddfa) === JSON.stringify(dfa.minimize()));
    });
}
