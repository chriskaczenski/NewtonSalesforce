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

    public String calculate(String operation, String expression){
        throwExceptionIfInvalidOperation(operation);
        String endpoint = RESOURCE_URL+operation+'/'+EncodingUtil.urlEncode(expression,'UTF-8');
        return HttpCalloutService.makeRequest(endpoint);
    }

    private void throwExceptionIfInvalidOperation(String op){
        if (!OPERATIONS.contains(op)){
            IllegalArgumentException e = new IllegalArgumentException();
            e.setMessage('Operation not supported! : '+op);
            throw e;
        }
    }
}
