import { LightningElement } from 'lwc';
import getCalculation from '@salesforce/apex/NewtonController.getCalculation';
import getOperations from '@salesforce/apex/NewtonController.getOperations';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class NewtonComponent extends LightningElement {
    isReady = false;
    operationOptions = [];
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
        this.result = '';
        let paramsObj = {
            operation : this.operationValue,
            expression : this.expressionValue
        }
        getCalculation({params: paramsObj})
        .then(result =>{
            let parsedResult = JSON.parse(result).result;
            this.result = result;
            this.showNotification('Success', parsedResult ,'success');
        })
        .catch((err) =>{
            this.result = err.body.message;

            //Salesforce errors have message property, but Newton uses error property
            try{
                let parsedResult = JSON.parse(this.result);
                if(parsedResult.hasOwnProperty('error')){
                    this.showNotification('Error',parsedResult.error,'error');
                }
            } catch{
                this.showNotification('Error',JSON.stringify(this.result),'error');
            }
        })
        .finally(()=>{
            this.isDisabled = false;
            this.expressionValue = '';
            this.operationValue = '';
        });
    }

    showNotification(title, message, variant) {
        const evt = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
        });
        this.dispatchEvent(evt);
    }

    async connectedCallback() {
        let operations = await getOperations();
        for (let op of operations) {
            this.operationOptions.push({label:op,value:op});
        }
        console.log(this.operationOptions);
        this.isReady = true;
    }

}