import { LightningElement } from 'lwc';
import getCalculation from '@salesforce/apex/NewtonController.getCalculation';

//todo - add more ops or dynamically fetch ops from controller
const operations = [
    { label: 'Derive', value: 'derive' }
]

export default class NewtonComponent extends LightningElement {
    operationOptions = operations;
    result;

    expressionValue;
    operationValue;
    isDisabled = false;

    handleInput(event){
        switch(event.target.name){
            case 'expression':
                this.expressionValue = event.target.value;
                break;
            case 'operation':
                this.operationValue = event.target.value;
                break;
            default:
                console.log(event.target.name);
                break;
        }
    }

    handleSubmit(){
        this.isDisabled = true;
        let paramsObj = {
            operation : this.operationValue,
            expression : this.expressionValue
        }
        getCalculation({params: paramsObj})
        .then(result =>{
            this.result = result;
        })
        .catch((err) =>{
            //Todo add toast notification
            console.log(err.body.message);
            this.result = err.body.message;
        })
        .finally(()=>{
            this.isDisabled = false;
            this.expressionValue = '';
            this.operationValue = '';
        });
    }



}