class Plane {
    /**
     * 
     * @param {*} graph 
     * @param {*} normal 
     * @param {*} centerCords 
     * @param {*} color 
     * @param {*} sideLength
     */
    constructor(graph, normal, centerCords, color, sideLength) {
        //ax + by + cz = 0

        // x = (-b(1)-c(1))/a
        // y = (-c(1)-a(4))/b
        
        // 0x + 0y + 1z = 0
        // cz = -ax-by
        // 
        // ax = ax + 0y     |a   0|
        // by = 0x + by     |0   b| 
        // cz = -ax -by     |-a -b|
        //then normalize and get perp basis...


        this.graph       = graph
        this.normal      = normal
        this.centerCords = centerCords
        this.sideLength  = sideLength
        this.color       = color
    }
    
    draw() {
        
    }

}