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

        let equivalenceClass = this.initialEquivalenceClass();
        let previousEquivalenceClass: State[][] = [];
            while(previousEquivalenceClass.length !== equivalenceClass.length){
                    previousEquivalenceClass = equivalenceClass;
            const newEquivalenceClass: State[][] = [];
            const behaviorOfNewClass: string[] = [];
                    for (const [state, stateTransitions] of Object.entries(transitions)) {
                const stateBehavior: string = this.findStateBehavior(previousEquivalenceClass, stateTransitions);
                if(behaviorOfNewClass.includes(stateBehavior)){
                    newEquivalenceClass[behaviorOfNewClass.indexOf(stateBehavior)].push(state);
                }
                else{
                    behaviorOfNewClass.push(stateBehavior);
                    
                    newEquivalenceClass.push([state]);
                }
            }      
            equivalenceClass = newEquivalenceClass;
        }
        return this.equivalenceClassToDFA(equivalenceClass);
    }

    initialEquivalenceClass(): State[][] {
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

    findStateBehavior(equivalenceClass: State[][], transitions: {
            0: State;
            1: State;
    }): string {
        let behavior = '';
        for (const [ , nextState] of Object.entries(transitions)) {
            for(let i = 0; i < equivalenceClass.length; i++){
                for(let j = 0; j < equivalenceClass[i].length; j++){
                    if(equivalenceClass[i][j] === nextState){
                        behavior += i;
                    }
                }
            }
        }
        return behavior;
    }

    equivalenceClassToDFA(equivalenceClass: State[][]): DeterministicFiniteStateMachine{
        const {
            description: { transitions, start, acceptStates },
        } = this;

        const newTransitions: {
            [key: string]: {
                0: State;
                1: State;
            }} = {};
        let newStart: State;
        const newAcceptStates: State[] = [];
        for(const group of equivalenceClass){
            for(const state in transitions){
                if(group[0] === state){
                    let transition0: string
                    let transition1: string
                    for(const group2 of equivalenceClass){
                        if(group2.includes(transitions[state][0])){
                            transition0 = group2.join('')
                        }
                        if(group2.includes(transitions[state][1])){
                            transition1 = group2.join('')
                        }
                    }
                    newTransitions[group.join('')] = { 0: transition0, 1: transition1 };
                }
            }
            for(const acceptState of acceptStates){
                if(group[0] === (acceptState)){
                    newAcceptStates.push(group.join(''))
                }
            }
            if(group.includes(start)){
                newStart = group.join('');
            }
        }

        const newDescription: DFADescription = {
            transitions: newTransitions,
            start: newStart,
            acceptStates: newAcceptStates
        };
        
        return new DeterministicFiniteStateMachine(newDescription);
    }
}
