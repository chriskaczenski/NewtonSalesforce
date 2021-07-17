public class HttpCalloutService {
    //This Service makes get requests to any endpoint and returns the body as String
    //Newton only needs GET requests, so that is all that is implemented
    //Todos inteneded to make the service generalize for POST, authorization

    //Todo #1 - Add HTTP verb arg, this only does Get now
    //Todo #2 - Add payload arg for post
    //Todo #3 - Add auth management 
    public static String makeRequest(String endpoint){
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpoint);
        request.setMethod('GET');
        HttpResponse response = http.send(request);

        if (response.getStatusCode() != 200){
            CalloutException e = new CalloutException();
            e.setMessage(response.getBody());
            throw e;
        }

        return response.getBody();
    }
}
