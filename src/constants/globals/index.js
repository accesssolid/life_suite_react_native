
export const role = {
    admin: 1,
    customer: 2,
    provider: 3,
}

export const order_types = {
    pending: 1,
    cancel: 2,
    confirmed: 3,
    on_the_way: 4,
    will_be_delayed: 5,
    arrived: 6,
    processing: 7,
    completed: 8,
    update_acceptance: 9,
    update_accepted: 10,
    update_reject: 11,
    delay_request_accept: 12,
    delay_request_reject: 13,
    suspend: 14,
    service_finished: 15,
    expired: 16,
    declined: 17
}

export const buttons_types = {
    "cancel": 1, //done
    "cancel&search": 2, //not done
    "reorder": 3, //not done
    "search_again": 4, //not done
    "block": 5, //done
    "chat": 6, //done
    "accept": 7,  //done
    "reject": 8, //done
    "suspend": 9, //done
    "pay": 10,  //not done
    "delay_accept": 11, //not done
    "decline": 12, // done delay reject,
    "start_order":13,
    "delay_order":14,
    "update_order":15,
    "already_delay":16,
    "view_rating":17,
    "tip_rate":18,
    "completed":19
}


export const buttons_customer = {
    [order_types.pending]: [{ title: "Cancel Order", type: buttons_types.cancel }, { title: "Cancel & Search again", type: buttons_types["cancel&search"] }],
    [order_types.cancel]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.confirmed]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [`${order_types.update_acceptance},${order_types.confirmed}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }, { title: "Accept", type: buttons_types.accept }, { title: "Reject", type: buttons_types.reject }],
    [`${order_types.update_accepted},${order_types.confirmed}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [`${order_types.update_reject},${order_types.confirmed}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.on_the_way]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.arrived]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.will_be_delayed]: [{ title: "Accept", type: buttons_types.delay_accept }, { title: "Decline", type: buttons_types.decline }, { title: "Chat", type: buttons_types.chat }],
    [order_types.delay_request_accept]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.suspend]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.expired]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.delay_request_reject]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.declined]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.completed]: [{ title: "Re-order", type: buttons_types.reorder }, { title: "Search again", type: buttons_types.search_again }, { title: "Block", type: buttons_types.block }],
    [order_types.processing]: [{ title: "Chat", type: buttons_types.chat }, { title: "Suspend", type: buttons_types.suspend }],
    [order_types.service_finished]: [{ title: "Chat", type: buttons_types.chat }, { title: "Suspend", type: buttons_types.suspend }, { title: "Pay now", type: buttons_types.pay }],
    [`${order_types.update_acceptance},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Suspend", type: buttons_types.suspend }, { title: "Accept", type: buttons_types.accept }, { title: "Reject", type: buttons_types.reject }],
    [`${order_types.update_accepted},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Suspend", type: buttons_types.suspend }],
    [`${order_types.update_reject},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat }, { title: "Suspend", type: buttons_types.suspend }],
}

export const buttons_provider = {
    [order_types.pending]: [{ title: "Accept", type: buttons_types.accept }, { title: "Decline", type: buttons_types.decline }],
    [order_types.cancel]: [{ title: "Block", type: buttons_types.block }],
    [order_types.confirmed]: [{ title: "Start Order", type: buttons_types.start_order }, { title: "Cancel Order", type: buttons_types.cancel }, { title: "Delay Order", type: buttons_types.delay_order },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [`${order_types.update_acceptance},${order_types.confirmed}`]: [{ title: "Start Order", type: buttons_types.start_order }, { title: "Cancel Order", type: buttons_types.cancel }, { title: "Delay Order", type: buttons_types.delay_order },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [`${order_types.update_accepted},${order_types.confirmed}`]: [{ title: "Start Order", type: buttons_types.start_order }, { title: "Cancel Order", type: buttons_types.cancel }, { title: "Delay Order", type: buttons_types.delay_order },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [`${order_types.update_reject},${order_types.confirmed}`]: [{ title: "Start Order", type: buttons_types.start_order }, { title: "Cancel Order", type: buttons_types.cancel }, { title: "Delay Order", type: buttons_types.delay_order },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [order_types.on_the_way]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.arrived]: [{ title: "Chat", type: buttons_types.chat }, { title: "Cancel Order", type: buttons_types.cancel }],
    [order_types.will_be_delayed]: [{ title: "Start Order", type: buttons_types.start_order },{ title: "Cancel Order", type: buttons_types.cancel }, { title: "Delayed Sent", type: buttons_types.already_delay },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [order_types.delay_request_accept]: [{ title: "Start Order", type: buttons_types.start_order },{ title: "Cancel Order", type: buttons_types.cancel }, { title: "Delay Order", type: buttons_types.delay_order },{ title: "Update Order", type: buttons_types.update_order},{ title: "Chat", type: buttons_types.chat}],
    [order_types.suspend]: [{ title: "Block", type: buttons_types.block }],
    [order_types.expired]: [{ title: "Block", type: buttons_types.block }],
    [order_types.delay_request_reject]: [{ title: "Block", type: buttons_types.block }],
    [order_types.declined]: [{ title: "Block", type: buttons_types.block }],
    [order_types.completed]: [{ title: "Block", type: buttons_types.block },{ title: "View Rating", type: buttons_types.view_rating }],
    [order_types.processing]: [{ title: "Chat", type: buttons_types.chat },{ title: "Update Order", type: buttons_types.update_order},{ title: "Completed", type: buttons_types.completed }],
    [order_types.service_finished]: [{ title: "Chat", type: buttons_types.chat },{ title: "Update Order", type: buttons_types.update_order}],
    [`${order_types.update_acceptance},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat },{ title: "Update Order", type: buttons_types.update_order}],
    [`${order_types.update_accepted},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat },{ title: "Update Order", type: buttons_types.update_order},{ title: "Completed", type: buttons_types.completed }],
    [`${order_types.update_reject},${order_types.processing}`]: [{ title: "Chat", type: buttons_types.chat },{ title: "Update Order", type: buttons_types.update_order},{ title: "Completed", type: buttons_types.completed }],
}

/*
Customer
pending == > 1.cancel order  2.cancel and search again

future == > 1.Chat  2.Cancel Order

future sub status
//
completed ==> 1.ReOrder 2.serach Again  3.Block

// No Sub status
Cancelled ==> 1.ReOrder 2.serach Again  3.Block

InProgress ==> 1.Chat 2.Suspend
*/
