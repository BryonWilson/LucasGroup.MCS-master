using System.Collections.Generic;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Flurl;
using Flurl.Http;

using LucasGroup.MCS.Models;
using System;
using Newtonsoft.Json.Serialization;
using Newtonsoft.Json.Converters;
using System.Text.RegularExpressions;
using System.Text;

namespace LucasGroup.MCS.Interfaces {

    public class BullhornApiInterface {
        private BullhornApiSettings _settings;
        private static FlurlClient _httpClient = new FlurlClient();
        private readonly StringContent _blankContent = new StringContent("");
        private AccessTokenResponse _accessResponse;
        private TaskCompletionSource<AccessTokenResponse> tcsAccess = new TaskCompletionSource<AccessTokenResponse>();
        private RestTokenResponse _tokenDetails;
        private TaskCompletionSource<RestTokenResponse> tcsRestToken;
        private List<HttpStatusCode> _validStatusList = new List<HttpStatusCode>(new[] {HttpStatusCode.OK, HttpStatusCode.InternalServerError});
        private ILogger<BullhornApiInterface> _logger;
        private DateTime _authTimeStamp;

        public DateTime TokenExpiresIn
        {
            get => _authTimeStamp.AddSeconds(_accessResponse?.ExpiresIn ?? 600);
            set => _authTimeStamp = value;
        }

        public BullhornApiInterface(IOptions<BullhornApiSettings> config, ILogger<BullhornApiInterface> logger)
        {
            _settings = config.Value;
            _logger = logger;
        }

        public async Task Authenticate(){

            tcsRestToken = new TaskCompletionSource<RestTokenResponse>();

            if(_tokenDetails == null){
            await GetRestToken();
            _tokenDetails = await tcsRestToken.Task;
            }
            // else if(hasAccessTokenExpired())
            // {
            //     await RefreshRestToken();
            //     _tokenDetails = await tcsRestToken.Task;
            // }
        }


        public async Task<TearSheetArrayResponse> GetTearsheetsByOwner(string ownerId){

            if(string.IsNullOrEmpty(ownerId)){
                throw new ArgumentNullException($"{nameof(ownerId)} cannot be null.");
            }
            // if(_tokenDetails == null){
            //     throw new NullReferenceException("Bullhorn authentication has not been established.");
            // }


            try{
                await Authenticate();

                var response = await _httpClient.Request($"{_tokenDetails.RestUrl}query/Tearsheet?fields=id,name,description,owner,jobOrders,candidates&where=owner.id={ownerId}")
                .WithHeader("BHRestToken", _tokenDetails.BhRestToken)
                .AllowAnyHttpStatus()
                .GetJsonAsync<TearSheetArrayResponse>();

                return response;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;

        }

        public async Task<IEnumerable<JobCandidate>> GetCandidatesByTearsheetId(string tearSheetId)
        {

            if(string.IsNullOrEmpty(tearSheetId)){
                throw new ArgumentNullException($"{nameof(tearSheetId)} cannot be null.");
            }
            // if(_tokenDetails == null){
            //     throw new NullReferenceException("Bullhorn authentication has not been established.");
            // }
            try
            {
                await Authenticate();

                var response = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/Tearsheet/{tearSheetId}/candidates")
                .SetQueryParam("fields", "id,firstName,lastName")
                .SetQueryParam("orderBy","lastName")
                .SetQueryParam("count","100")
                .WithHeader("BHRestToken", _tokenDetails.BhRestToken)
                .AllowAnyHttpStatus()
                .GetJsonAsync<TearSheetCandidateResponse>();

                var content = response.Data as IEnumerable<JobCandidate>;

                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<IEnumerable<Job>> GetJobsByTearsheetId(string tearSheetId)
        {
            if(string.IsNullOrEmpty(tearSheetId)){
                throw new ArgumentNullException($"{nameof(tearSheetId)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var response = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/Tearsheet/{tearSheetId}/jobOrders")
                .SetQueryParam("fields", "id,title,salary,employmentType,status,clientCorporation,clientContact,owner")
                .SetQueryParam("orderBy", "title")
                .SetQueryParam("count", "100")
                .WithHeader("BHRestToken", _tokenDetails.BhRestToken)
                .AllowAnyHttpStatus()
                .GetJsonAsync<TearSheetJobResponse>();


                var content = response.Data as IEnumerable<Job>;

                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<Job> GetJobByJobOrderId(string jobId)
        {
            if(string.IsNullOrEmpty(jobId)){
                throw new ArgumentNullException($"{nameof(jobId)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var response = (await _httpClient.Request($"{_tokenDetails.RestUrl}entity/JobOrder/{jobId}")
                .SetQueryParam("fields", "*")
                .WithHeader("BHRestToken", _tokenDetails.BhRestToken)
                .AllowAnyHttpStatus()
                .GetJsonAsync<JobQueryResponse>()).Data;

                return response;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<InternalSubmissionResponse> CreateInternalSubmissionAsync(InternalSubmissionRequest newRequest){

            if(newRequest == null){
                throw new ArgumentNullException($"{nameof(newRequest)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var settings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new StringEnumConverter(), new Interfaces.JsonPathConverter() },
                    StringEscapeHandling = StringEscapeHandling.EscapeHtml
                };
                var req = JsonConvert.SerializeObject(newRequest, settings);
                var resp = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/JobSubmission")
                        .AllowAnyHttpStatus()
                        .WithHeader("BHRestToken", _tokenDetails.BhRestToken).PutStringAsync(req);
                if(!resp.IsSuccessStatusCode){
                    _logger.LogWarning("Internal Submission: Status:{0}, Reason: {1}", resp.StatusCode, resp.ReasonPhrase);
                }
                
                var content = JsonConvert.DeserializeObject<InternalSubmissionResponse>(await resp.Content.ReadAsStringAsync());

                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<ClientSubmissionResponse> CreateClientSubmissionAsync(ClientSubmissionRequest newRequest){

            if(newRequest == null){
                throw new ArgumentNullException($"{nameof(newRequest)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var settings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new StringEnumConverter(), new Interfaces.JsonPathConverter() },
                    StringEscapeHandling = StringEscapeHandling.EscapeHtml
                };
                var req = JsonConvert.SerializeObject(newRequest, settings);
                var resp = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/Sendout")
                        .AllowAnyHttpStatus()
                        .WithHeader("BHRestToken", _tokenDetails.BhRestToken).PutStringAsync(req);
                if(!resp.IsSuccessStatusCode){
                    _logger.LogWarning("Client Submission: Status:{0}, Reason: {1}", resp.StatusCode, resp.ReasonPhrase);
                }
                
                var content = JsonConvert.DeserializeObject<ClientSubmissionResponse>(await resp.Content.ReadAsStringAsync());
                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<InterviewResponse> CreateInterviewAsync(InterviewRequest newRequest){

            if(newRequest == null){
                throw new ArgumentNullException($"{nameof(newRequest)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var settings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new StringEnumConverter(), new Interfaces.JsonPathConverter() },
                    StringEscapeHandling = StringEscapeHandling.EscapeHtml
                };
                var req = JsonConvert.SerializeObject(newRequest, settings);
                var resp = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/JobSubmission")
                        .AllowAnyHttpStatus()
                        .WithHeader("BHRestToken", _tokenDetails.BhRestToken).PutStringAsync(req);
                if(!resp.IsSuccessStatusCode){
                    _logger.LogWarning("Interview Submission: Status:{0}, Reason: {1}", resp.StatusCode, resp.ReasonPhrase);
                }
                
                var content = JsonConvert.DeserializeObject<InterviewResponse>(await resp.Content.ReadAsStringAsync());

                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        public async Task<AppointmentResponse> CreateAppointmentAsync(AppointmentRequest newRequest){

            if(newRequest == null){
                throw new ArgumentNullException($"{nameof(newRequest)} cannot be null.");
            }

            try
            {
                await Authenticate();
                var settings = new JsonSerializerSettings
                {
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new StringEnumConverter(), new Interfaces.JsonPathConverter() },
                    StringEscapeHandling = StringEscapeHandling.EscapeHtml
                };
                var req = JsonConvert.SerializeObject(newRequest, settings);
                var resp = await _httpClient.Request($"{_tokenDetails.RestUrl}entity/Appointment")
                        .AllowAnyHttpStatus()
                        .WithHeader("BHRestToken", _tokenDetails.BhRestToken).PutStringAsync(req);
                if(!resp.IsSuccessStatusCode){
                    _logger.LogWarning("Appointment Submission: Status:{0}, Reason: {1}", resp.StatusCode, resp.ReasonPhrase);
                }
                
                var content = JsonConvert.DeserializeObject<AppointmentResponse>(await resp.Content.ReadAsStringAsync());
                return content;
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return null;
        }

        private async Task<string> GetApiTokenUrl()
        {
            string _url = string.Empty;
            try{
                var response = (await $"{_settings.OauthAuthorizeUrl}/oauth/authorize?client_id={_settings.ClientId}&response_type=code&state=test&username={_settings.Username}&password={_settings.Password}&action=Login"
                .AllowAnyHttpStatus().PostAsync(new StringContent("")));
                var content = await response?.Content?.ReadAsStringAsync();
                if(content.Contains("errors")){
                    throw new HttpRequestException("Error occurred during login.");
                }
                else{
                    _url = response?.Headers?.Location?.ToString().Split('?')[1];
                }

            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }

            return _url;

        }

        private async Task<string> GetAccessToken(string url)
        {
            var oauthUrl = url; // await GetApiTokenUrl();
            _accessResponse = JsonConvert.DeserializeObject<AccessTokenResponse>(await (await $"{_settings.OauthAuthorizeUrl}/oauth/token?grant_type=authorization_code&client_secret={_settings.ClientSecret}&{oauthUrl}"
            .AllowAnyHttpStatus().PostAsync(new StringContent("")))?.Content.ReadAsStringAsync());

            tcsAccess.SetResult(_accessResponse);

            return _accessResponse?.AccessToken;

        }

        private async Task RefreshRestToken(){

            try
            {
                tcsAccess = new TaskCompletionSource<AccessTokenResponse>();
                tcsAccess.SetResult(JsonConvert.DeserializeObject<AccessTokenResponse>(await (await $"{_settings.OauthAuthorizeUrl}/oauth/token?grant_type=refresh_token&refresh_token={_accessResponse.RefreshToken}"
                .AllowAnyHttpStatus().PostAsync(new StringContent("")))?.Content.ReadAsStringAsync()));
            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }
        }

        public async Task GetRestToken()
        {
            try{
                var oauthUrl = string.Empty;

                await Task.Factory.StartNew(async () => {

                    await $"{_settings.OauthAuthorizeUrl}/oauth/authorize?client_id={_settings.ClientId}&response_type=code&state=test&username={_settings.Username}&password={_settings.Password}&action=Login"
                    .AllowAnyHttpStatus().PostAsync(new StringContent("")).ContinueWith(async (resp) => {
                        var content = await resp.Result?.Content?.ReadAsStringAsync();
                        if(content.Contains("errors")){
                            throw new HttpRequestException("Error occurred during login.");
                        }
                        else{
                            oauthUrl = resp.Result?.Headers?.Location?.ToString().Split('?')[1];
                        }
                        await Task.Delay(500);

                    }).ContinueWith(async (authTask) => {

                        if(_accessResponse != null && hasAccessTokenExpired()){
                            await RefreshRestToken();
                        }
                        else
                        {

                            await GetAccessToken(oauthUrl).ConfigureAwait(true);
                        }

                    })
                    .ContinueWith(async (accessTask) => {
                        _accessResponse = await tcsAccess.Task;
                        TokenExpiresIn = DateTime.Now;
                        tcsRestToken.SetResult(JsonConvert.DeserializeObject<RestTokenResponse>(await (await _httpClient.Request($"{_settings.RestTokenRequestUrl}/rest-services/login?version=2.0&access_token={_accessResponse.AccessToken}")
                                                            .PostAsync(new StringContent("")))?.Content.ReadAsStringAsync()));

                    })
                    .ConfigureAwait(true);
                });

            }
            catch(AggregateException aex){
                aex.Handle(ex => {
                    _logger.LogError(ex, ex.Message);
                    return true;
                });
            }
        }

        private bool hasAccessTokenExpired()
        {
            return TokenExpiresIn < DateTime.Now;
        }
    }
}
