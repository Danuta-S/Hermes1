using HermesChat.Data;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using Entity;
using Services;
using System.Linq;

namespace HermesChat.Hubs
{
    public class ChatHub : Hub
    {
        public static List<string> roomList = new List<string>();
        public static List<string> usersList = new List<string>();
        public async Task SendMessage(string user, string message, string room, bool join)
        {
            if (join)
            {
                //await JoinRoom(room).ConfigureAwait(false);
                await Clients.Group(room).SendAsync("ReceiveMessage", user, " joined to " + room).ConfigureAwait(true);

            }
            else
            {
                if (message.Length > 0)
                {
                    await Clients.Group(room).SendAsync("ReceiveMessage", user, message).ConfigureAwait(true);
                }
            }
        }

        //public Task GetRooms()
        //{

        //    return Groups.;
        //}

        
        //public override async Task OnConnectedAsync()
        //{
        //    var roomName = new string[] { };
        //    var roomName = new List<string>();
        //    if (!roomsList.Contains(roomName))
        //    {
        //        roomsList.Add(roomName);
        //    }
        //    await Clients.All.SendAsync("GetRoomList", roomsList);
        //    await base.OnConnectedAsync();
        //}
        //public override async Task OnDisconnectedAsync(Exception? exception)
        //{
        //    var roomName = new List<string>();
        //    roomsList.Remove(roomName);
        //    await Clients.All.SendAsync("GetRoomList", roomsList);
        //    await base.OnDisconnectedAsync(exception);
        //}

        public async Task CreateRoom(string roomName)
        {
            if (!roomList.Contains(roomName))
            {
                roomList.Add(roomName);
            }

            await Clients.All.SendAsync("GetRoomList", roomList);
            await Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }

        public Task LeaveRoom(string roomName)
        {
            //var roomName = new List<string>();
            //    roomsList.Remove(roomName);
            //    await Clients.All.SendAsync("GetRoomList", roomsList);
            //    await base.OnDisconnectedAsync(exception);
            return Groups.RemoveFromGroupAsync(Context.ConnectionId, roomName);
        }

        

        public override async Task OnConnectedAsync()
        {
            var userName = Context.User.Identity.Name;
            if (!usersList.Contains(userName))
            {
                usersList.Add(userName);
            }
            await Clients.All.SendAsync("GetOnlineUsers", usersList);
            await Clients.All.SendAsync("GetRoomList", roomList);
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            var userName = Context.User.Identity.Name;
            usersList.Remove(userName);
            await Clients.All.SendAsync("GetOnlineUsers", usersList);
            await base.OnDisconnectedAsync(exception);
        }
    }
}
