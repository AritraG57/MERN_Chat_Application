import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },

    receiverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default: null,
    },
    // Used only for group chats
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    text : {
        type : String,
        default: "",
        trim: true,
    },
    image : {
        type : String,
        default: "",
    },
},{timestamps : true});

messageSchema.pre("validate", function (next) {
  const hasReceiver = !!this.receiverId;
  const hasGroup = !!this.groupId;

  if (hasReceiver === hasGroup) {
    return next(
      new Error("A message must have either receiverId or groupId, but not both.")
    );
  }

  //next();
});

const Message = mongoose.model("Message",messageSchema);

export default Message;