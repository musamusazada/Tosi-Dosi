using LiveChat.DAL;
using LiveChat.Models;
using Microsoft.AspNetCore.SignalR;
using System.Text;
using System.Threading.Tasks;

namespace LiveChat
{

    public class ChatHub : Hub
    {

        private readonly AppDbContext _context;
        private readonly string _botUser;
        public ChatHub(AppDbContext context)
        {
            _context = context;
            _botUser = "Tosi-Dosi-Bot";
        }

        public async Task CreateRoom(string username, string groupLink)
        {
            Room room = new Room
            {
                roomLink = groupLink,
            };

            await _context.Rooms.AddAsync(room);
            await _context.SaveChangesAsync();
            await Groups.AddToGroupAsync(Context.ConnectionId, room.roomLink);
            await Clients.Group(groupLink).SendAsync("CreateChat", groupLink, username, $"{username} has joined", _botUser);

        }

        public async Task SendMessage(string user, string message, string chatRoomId)
        {
            await Clients.Group(chatRoomId).SendAsync("ReceiveMessage", user, message);
        }
        public async Task JoinRoom(string username, string roomLink)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, roomLink);
            await Clients.Group(roomLink).SendAsync("JoinChat", username, $"{username} has joined", _botUser);
        }
    }

}