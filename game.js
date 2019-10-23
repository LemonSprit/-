var gameDom = document.getElementById("game"); //获取游戏的容器
var size = 45; //每一个小块的宽高
/**
 * 约定
 * 0：空白
 * 1：玩家
 * 2：墙
 * 3：箱子
 */
var map = [
    [0, 0, 2, 2, 2, 2, 2, 0, 0],
    [0, 0, 2, 0, 1, 0, 2, 0, 0],
    [0, 0, 2, 0, 3, 0, 2, 0, 0],
    [2, 2, 2, 0, 0, 0, 2, 2, 2],
    [2, 0, 0, 0, 3, 0, 0, 0, 2],
    [2, 0, 3, 3, 3, 3, 3, 0, 2],
    [2, 0, 0, 0, 3, 0, 0, 0, 2],
    [2, 2, 0, 3, 3, 3, 0, 2, 2],
    [0, 2, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 0, 0, 3, 0, 0, 2, 0],
    [0, 2, 0, 0, 0, 0, 0, 2, 0],
    [0, 2, 2, 2, 2, 2, 2, 2, 0]
];//地图

//地图中的正确位置
var correct = [
    { row: 3, col: 4 },
    { row: 4, col: 4 },
    { row: 5, col: 2 },
    { row: 5, col: 3 },
    { row: 5, col: 4 },
    { row: 5, col: 5 },
    { row: 5, col: 6 },
    { row: 6, col: 4 },
    { row: 7, col: 4 },
    { row: 8, col: 4 },
    { row: 9, col: 4 },
    { row: 10, col: 4 }
];


/**
 * 从地图中得到玩家位置
 */
function getPlayerLoc() {
    //遍历地图
    for (var i = 0; i < map.length; i++) {
        var row = map[i];
        for (var j = 0; j < row.length; j++) {
            var value = map[i][j];
            if (value === 1) {
                //找到玩家了，当前的i和j就是玩家的位置
                return { //返回一个对象
                    row: i,
                    col: j
                }
            }
        }
    }
}

/**
 * 判断指定的行和列是否是正确位置
 * @param {*} row 
 * @param {*} col 
 */
function isCorrect(row, col) {
    for (var i = 0; i < correct.length; i++) {
        var loc = correct[i]; //拿到数组中当前的正确位置
        if (loc.row === row && loc.col === col) {
            return true; //找到了， 是正确位置
        }
    }
    return false; //没有找到， 不是正确位置
}

/**
 * 渲染地图
 * 根据地图中的不同元素，生成不同的div，加入到id为game的div中去
 */
function render() {
    //1. 清空游戏容器
    gameDom.innerHTML = "";
    //2. 遍历地图的所有内容
    for (var i = 0; i < map.length; i++) {
        var row = map[i]; //拿到当前行，当前行也是一个数组
        for (var j = 0; j < row.length; j++) {
            // row[j] = map[i][j] 表示 第i行，第j列
            // 生成对应的div
            var div = document.createElement("div");
            div.className = "item";
            // 得到当前行当前列的值
            var value = map[i][j]; // row[j] 一样 
            var isRight = isCorrect(i, j); //当前位置是否是箱子正确位置
            if (value === 0) {
                // 空白
                if (isRight) {//正确位置的空白
                    div.classList.add("correct"); //添加一个类样式
                }
                else {
                    //非正确位置的空白
                    continue; //进行下一次循环
                }
            }
            else if (value === 1) {
                div.classList.add("player"); //玩家
            }
            else if (value === 2) {
                div.classList.add("wall"); //墙
            }
            //value为3正确位置的绿色箱子和value为3不正确的黄色箱子
            else {
                if (isRight) {
                    div.classList.add("correct-box")
                }
                else {
                    div.classList.add("box")
                }
            }
            //设置div的坐标
            div.style.left = size * j + "px";
            div.style.top = size * i + "px";
            gameDom.appendChild(div);
        }
    }
    //3. 设置容器的宽高
    var rowNumber = map.length; //地图的行数
    var colNumber = map[0].length; //得到第一行的列数，随便取一行即可，因为每一行的列数一致
    gameDom.style.width = colNumber * size + "px";
    gameDom.style.height = rowNumber * size + "px";
}

render();

/**
 * 让玩家按照指定的方向，移动一格
 * @param {*} direction left、right、up、down
 */
function move(direction) {
    //得到玩家在当前方向上的下一个坐标
    var playerLoc = getPlayerLoc(); //得到玩家位置
    var nextLoc = getNextLoc(playerLoc); //得到玩家的下一个位置
    //通过坐标，拿到地图上皮卡丘想移动下一个坐标的值
    var value = map[nextLoc.row][nextLoc.col];

    if (value === 2) {
        //前方是墙
        return;
    }
    else if (value === 0) {
        //前方是空白
        //交换 playerLoc 和 nextLoc 的值
        exchange(playerLoc, nextLoc);
    }
    else if (value === 3) {
        //前方是箱子 nextLoc位置是箱子
        //要看箱子的前方
        var nextNextLoc = getNextLoc(nextLoc) //传入箱子的坐标，得到该方向上，箱子的下一个位置
        var nextNextValue = map[nextNextLoc.row][nextNextLoc.col]; //得到箱子下一个位置的值
        if (nextNextValue === 0) {
            //箱子前方没有东西，可以移动
            //箱子和下一个位置的空白互换
            exchange(nextLoc, nextNextLoc);
            //玩家和下一个位置互换
            exchange(playerLoc, nextLoc);
        }
        else {
            //其他情况都不能动
            return;
        }
    }

    //重新渲染
    render();

    /**
     * 根据传递的坐标，得到当前方向上的下一个坐标
     */
    function getNextLoc(originLoc) {
        if (direction === "left") {
            return {
                row: originLoc.row,
                col: originLoc.col - 1
            }
        }
        else if (direction === "right") {
            return {
                row: originLoc.row,
                col: originLoc.col + 1
            }
        }
        else if (direction === "up") {
            return {
                row: originLoc.row - 1,
                col: originLoc.col
            }
        }
        else {
            return {
                row: originLoc.row + 1,
                col: originLoc.col
            }
        }
    }

    /**
     * 交换两个位置的值
     * @param {*} loc1 
     * @param {*} loc2 
     */
    function exchange(loc1, loc2) {
        var temp = map[loc1.row][loc1.col]; //存放第一个位置的值
        map[loc1.row][loc1.col] = map[loc2.row][loc2.col]; //把第一个位置的值改成第二个位置的值
        map[loc2.row][loc2.col] = temp; //使用之前暂存的第一个位置的值，放到第二个位置
    }
}

/**
 * 判断游戏是否胜利
 */
function isWin() {
    //循环所有的正确坐标
    for (var i = 0; i < correct.length; i++) {
        var loc = correct[i];
        var value = map[loc.row][loc.col];//拿到这个坐标下的值
        if (value !== 3) {
            //这个位置没有箱子
            return false; //没有胜利
        }
    }
    return true;
}

//加入键盘事件

window.onkeydown = function (e) {
    if (e.key === "ArrowUp") {
        move("up")
    }
    else if (e.key === "ArrowDown") {
        move("down")
    }
    else if (e.key === "ArrowLeft") {
        move("left")
    }
    else if (e.key === "ArrowRight") {
        move("right");
    }
    else {
        return;
    }
    //移动之后，游戏是否胜利
    if (isWin()) {
        console.log("胜利胜利")
        window.onkeydown = null;
    }
}