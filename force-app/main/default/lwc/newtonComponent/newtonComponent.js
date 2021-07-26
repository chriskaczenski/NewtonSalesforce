import { LightningElement } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getCalculation from '@salesforce/apex/NewtonController.getCalculation';
import getOperations from '@salesforce/apex/NewtonController.getOperations';

const columns = [{label:'Operation',fieldName:'operation'},
    {label:'Expression',fieldName:'expression'},
    {label:'Result',fieldName:'result'}];

export default class NewtonComponent extends LightningElement {
    isReady = false;
    isButtonDisabled = false;
    operationOptions = [];
    columns = columns;
    data = [];
    expressionValue;
    operationValue;
    result;

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
        this.isButtonDisabled = true;
        this.result = '';
        let paramsObj = {
            operation : this.operationValue,
            expression : this.expressionValue
        }
        getCalculation({params: paramsObj})
        .then(data =>{
            let parsedData = JSON.parse(data);
            this.result = data;
            this.data = [...this.data,parsedData]
            this.showNotification('Success', parsedData.result ,'success');
        })
        .catch((err) =>{
            this.handleError(err);
        })
        .finally(()=>{
            this.isButtonDisabled = false;
            this.expressionValue = '';
            this.operationValue = '';
        });
    }

    handleError(err){
        this.result = err.body.message;
        //Salesforce errors have message key, but Newton uses error key
        try{
            let parsedResult = JSON.parse(this.result);
            if(parsedResult.hasOwnProperty('error')){
                this.showNotification('Error',parsedResult.error,'error');
            }
        } catch{
            this.showNotification('Error',JSON.stringify(this.result),'error');
        }
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
        this.isReady = true;
    }
}