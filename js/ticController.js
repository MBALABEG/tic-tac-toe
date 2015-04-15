(function(){

    angular
            // firebase dependencies
    .module ("ticApp", ['firebase'])

        .controller('TicController',  TicController);

        TicController.$inject = ['$firebaseObject', '$firebaseArray'];

        // gives us the firebase library
        function TicController($firebaseObject,  $firebaseArray){

            var self = this;    // capture variable set to this controller object

            self.fbgame = getGame();

                function getGame(){

                        // create the firebase database
                        var ref = new Firebase("https://ticapp.firebaseio.com/");
                        var  fbObject = $firebaseObject(ref);
                        return fbObject;
                }

                self.fbgame.$save();

                    //initialize all box vaues to null before getting the first click
                    self.fbgame.board = [
                        {
                            boxValue: "",
                            boardNum: 1
                        },   {
                            boxValue: "",
                            boardNum: 2
                        },   {
                            boxValue: "",
                            boardNum: 3
                        },   {
                            boxValue: "",
                            boardNum: 4
                        },   {
                            boxValue: "",
                            boardNum: 5
                        },   {
                            boxValue: "",
                            boardNum: 6
                        },   {
                            boxValue: "",
                            boardNum: 7
                        },   {
                            boxValue: "",
                            boardNum: 8
                        },   {
                            boxValue: "",
                            boardNum: 9
                        }

                    ];

                    var sessionPlayer = null;

                    // winning box combinations
                    var  winingCombination = [ [ 0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8 ], [0,4,8], [2,5,8] , [2,4,6] ];

                    self.choosePlayer = function (player)
                    {
                        sessionPlayer = player;
                    }

                     // add a turn variable to the firebase object
                     self.fbgame.turn = 0;

                     self.fbgame.$save();

                    function isOdd(n) {
                        return n == parseFloat(n) && !!(n % 2);
                    }

                    // Action taken upon a mouse click
                    self.click = function(index)
                    {
                        // increment turn with each click, visible to both players thru firebase
                        // it becomes 1 at first click and then it is incremented
                        (self.fbgame.turn)++;
                        console.log(sessionPlayer);
                        console.log(self.fbgame.turn);

                        // If a box has been clicked, do not allow clicking again.
                        if (self.fbgame.board[index].boxValue)
                        {
                            return false;
                        }

                         if (isOdd(self.fbgame.turn) && sessionPlayer == 'x')
                        {
                            self.fbgame.board[index].boxValue = 'x';
                        }
                        else
                        {
                            self.fbgame.board[index].boxValue = 'o';
                        }

                        // save data to firebase
                        self.fbgame.$save();

                        //oCall function to check for a win or tie
                        checkForWinners();
                    }

                    //Check for win function
                    function checkForWinners()
                    {
                        // loop through winning 3 box combinations
                        for(var i=0; i< winingCombination.length; i++)
                        {
                            // Are all 3 boxes filled for this winning combo?
                            if (self.fbgame.board[winingCombination[i][0]].boxValue &&
                                self.fbgame.board[winingCombination[i][1]].boxValue &&
                                self.fbgame.board[winingCombination[i][2]].boxValue )
                            {

                                 // test for a winning condition
                                if ( self.fbgame.board[winingCombination[i][0]].boxValue == self.fbgame.board[winingCombination[i][1]].boxValue
                                        &&
                                     self.fbgame.board[winingCombination[i][0]].boxValue == self.fbgame.board[winingCombination[i][2]].boxValue)
                                {
                                    playAgain();
                                    self.fbgame.$save();
                                 }

                                 // check for a tie situation
                                 if (self.fbgame.turn == 9 )
                                 {
                                    playAgainTie();
                                    self.fbgame.$save();
                                     return;
                                 }
                            }
                        }
                    }

                function playAgainTie()
                {
                    if (confirm("It is a tie! Press a key if you want to play again?"))
                        location.reload(true);
                }

                function playAgain()
                {
                    if (confirm("You Win! Press a key if you want to play again?"))
                        location.reload(true);
                }
        }
})();


