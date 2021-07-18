public class NewtonController {
    //This controller does math using the Newton API
    //https://github.com/aunyks/newton-api  

    private static final String[] OPERATIONS = new list<String> {'simplify','factor','derive','integrate',
        'zeroes','tangent','area','cos','sin','tan','arccos','arcsin','arctan','abs','log'};
    private static final String BASE_URL = 'https://newton.vercel.app';
    private static final String RESOURCE_URL = BASE_URL+'/api/v2/';

    public String demoCalculate(){
        String operation = 'derive';
        String expression = 'x^2';
        String result = calculate(operation,expression);

        system.debug(result);
        return result;
    }

    @AuraEnabled
    public static String getCalculation(NewtonArgumentWrapper params){
        throwExceptionIfInputBlank(params);
        try{
            return calculate(params.operation, params.expression);
        } catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
    }

    @AuraEnabled(cacheable=true)
    public static String[] getOperations(){
        return OPERATIONS;
    }

    public static String calculate(String operation, String expression){
        throwExceptionIfInvalidOperation(operation);
        String endpoint = RESOURCE_URL+operation+'/'+EncodingUtil.urlEncode(expression,'UTF-8');
        return HttpCalloutService.makeRequest(endpoint);
    }

    private static void throwExceptionIfInvalidOperation(String op){
        if (!OPERATIONS.contains(op)){
            IllegalArgumentException e = new IllegalArgumentException();
            e.setMessage('Operation not supported! : '+op);
            throw e;
        }
    }

    private static void throwExceptionIfInputBlank(NewtonArgumentWrapper params){
        if (params.operation == null || params.operation == '' ||
            params.expression == null || params.expression == ''){
                throw new AuraHandledException('Please enter both an expression and operation!');
         }
    }

    public class NewtonArgumentWrapper{
        @AuraEnabled
        public String operation { get; set;}

        @AuraEnabled
        public String expression { get; set;}
    }
}
