import test from 'ava';

import NonDeterministicFiniteStateMachine, { NFADescription } from './nfa';

const machineTests: {
    [name: string]: {
        description: NFADescription,
        accepted: string[],
        rejected: string[],
    }
} = {
    startsWith0: {
        description: {
            transitions: {
                S: {
                    0: ['A']
                },
                A: {
                    0: ['A'], 
                    1: ['A']
                },
            },
            start: 'S',
            acceptStates: ['A']
        },
        accepted: ['0', '01', '00000', '0111111'],
        rejected: ['', '10', '10001010', '111111', '101111'],
    },
    divisibleBy3: {
        description: {
            transitions: {
                r0: {
                    0: ['r0'],
                    1: ['r1']
                },
                r1: {
                    0: ['r2'],
                    1: ['r0']
                },
                r2: {
                    0: ['r1'],
                    1: ['r2']
                }
            },
            start: 'r0',
            acceptStates: ['r0']
        },
        accepted: ['', '0', '11', '00000', '110000', '101111111101'],
        rejected: ['10', '1010', '100000', '1011111'],
    },
    StartsEndsWith010: {
        description: {
            transitions: {
                A: {
                    0: ['B']
                },
                B: {
                    1: ['C']
                },
                C: {
                    0: ['D'],
                },
                D:{
                    0: ['D', 'E'],
                    1: ['D']
                },
                E:{
                    1: ['F']
                }, 
                F:{
                    0: ['G']
                }
            },
            start: 'A',
            acceptStates: ['G']
        },
        accepted: ['010010', '0101010', '01011010', '01010010'],
        rejected: ['010', '1110', '1111', '01001', '1011'],
    }, 
    perfectSquaresLessThan12: {
        description: {
            transitions: {
                A: {
                    lambda: ['B', 'D'],
                },
                B: {
                    0: ['C'],
                },
                C: {
                    lambda: ['D'],
                    0: ['C'],
                },
                D:{
                    1: ['E']
                },
                E:{
                    0: ['F']
                },
                F:{
                    0: ['G']
                },
                G:{
                    1: ['H']
                },
            },
            start: 'A',
            acceptStates: ['A', 'C', 'E', 'G', 'H']
        },
        accepted: ['','0', '1', '100', '1001', '0001001', '00'],
        rejected: ['10', '11' ,'101','110', '111', '1000', '1010', '1011', '1100'],
    },
    universalStartsEndsWith0: {
        description: {
            transitions: {
                A: {
                    lambda: ['B']
                },
                B: {
                    0: ['C'],
                },
                C: {
                    0: ['C', 'D'],
                    1: ['C']
                },
                D:{
                    lambda: ['A'],
                }
            },
            start: 'A',
            acceptStates: ['A', 'D']
        },
        accepted: ['', '00', '010', '00000', '011011100', '01110010', '01100010'],
        rejected: ['0', '01', '10', '11','01101', '100110'],
    },
};

for(const [name, testDesc] of Object.entries(machineTests)) {
    test(`${name}/nfa/constructor`, (t) =>{
        const nfa = new NonDeterministicFiniteStateMachine(testDesc.description);
        t.truthy(nfa);
    });

    test(`${name}/nfa/transitions`, (t) => {
        const nfa = new NonDeterministicFiniteStateMachine(testDesc.description);
        const { transitions } = testDesc.description;
    
        for(const [state, stateTransitions] of Object.entries(transitions)) {
            for(const [symbol, nextStates] of Object.entries(stateTransitions)) {
                t.assert(nextStates === nfa.transition(state, symbol));
            }
        }
    });

    test(`${name}/nfa/accepts`, (t) => {
        const nfa = new NonDeterministicFiniteStateMachine(testDesc.description);
        const { accepted, rejected } = testDesc;
    
        for(const s of accepted) {
            t.assert(nfa.accepts(s));
        }

        for(const s of rejected) {
            t.assert(!nfa.accepts(s));
        }
    });
}
