-------> List of APIs in DevTinder Application


--> Auth Router
- POST / signup
- POST / login
- POST / logOut

--> Profile Router
- GET / profile/data
- PATCH / profile/update
- DELETE / profile/delete
- GET / profile/settings
- PATCH / profile/settings/update

-> Connection Request
- POST / request/send/interested/: userID
- POST / request/send/ignored/: userID
- POST / request/review/accepted/: requestID
- POST / request/review/rejected/: requestID

- GET / user/connections
- GET / user/request
- GET / user/feed

Status: Ignored, rejected, interested, accepted



